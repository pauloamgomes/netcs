import * as crypto from "crypto";
import isbot from "isbot";
import { headers } from "next/headers";
import IPinfoWrapper from "node-ipinfo";
import { UAParser } from "ua-parser-js";

import { db } from "~/lib/db";
import rateLimiter from "~/lib/rate-limit";
import { articleViewsTable } from "~/models/schema";
import { ArticleViewsSchema } from "~/models/validation";

const IPINFO_TOKEN = process.env.IPINFO_TOKEN;
const pageViewsEnabled = process.env.ARTICLE_PAGE_VIEWS_ENABLED === "true";

const limiter = rateLimiter({
  interval: 60 * 1000,
});

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  if (!pageViewsEnabled) {
    return Response.json({ hit: false });
  }

  const headersList = headers();
  const referer = headersList.get("referer");
  const agentHeader = headersList.get("user-agent");

  if (!agentHeader) {
    return new Response("No user agent");
  }

  const isBot = isbot(agentHeader);

  if (isBot) {
    return Response.json({ hit: false });
  }

  const ip = (headersList.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];

  try {
    await limiter.check(1, `${ip}-${params.slug}`);
  } catch {
    return Response.json({ hit: false }, { status: 429 });
  }

  const ipHash = crypto
    .createHash("md5")
    .update(`${ip}-${new Date().toLocaleDateString()}`, "utf-8")
    .digest("hex");

  const { browser, device } = UAParser(agentHeader);

  let country = "";

  if (IPINFO_TOKEN) {
    const ipinfoWrapper = new IPinfoWrapper(IPINFO_TOKEN);
    country = (await (await ipinfoWrapper.lookupIp(ip).catch())?.country) || "";
  }

  const body = ArticleViewsSchema.parse({
    slug: params.slug,
    ipAddress: ipHash,
    referer,
    country,
    device: JSON.stringify(device || {}),
    browser: JSON.stringify(browser || {}),
  });

  try {
    await db.insert(articleViewsTable).values(body).run();
  } catch (error) {
    console.error(error);
  }

  return Response.json({ hit: true });
}
