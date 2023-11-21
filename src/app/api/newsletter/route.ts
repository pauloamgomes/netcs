import { eq, sql } from "drizzle-orm";
import isbot from "isbot";
import { headers } from "next/headers";
import IPinfoWrapper from "node-ipinfo";

import { db } from "~/lib/db";
import rateLimiter from "~/lib/rate-limit";
import { newsletterSignupsTable } from "~/models/schema";
import { NewsletterSignupsSchema } from "~/models/validation";

const IPINFO_TOKEN = process.env.IPINFO_TOKEN;

const limiter = rateLimiter({
  interval: 60 * 1000,
});

export async function POST(request: Request) {
  const { email } = await request.json();

  const headersList = headers();
  const agentHeader = headersList.get("user-agent");

  if (!agentHeader || !email) {
    return Response.json({ status: "error" });
  }

  const isBot = isbot(agentHeader);

  if (isBot) {
    return Response.json({ status: "success" });
  }

  try {
    const ip = (headersList.get("x-forwarded-for") ?? "127.0.0.1").split(
      ","
    )[0];

    await limiter.check(1, `${ip}-${email}`);

    let country = "";

    if (IPINFO_TOKEN) {
      const ipinfoWrapper = new IPinfoWrapper(IPINFO_TOKEN);
      country =
        (await (await ipinfoWrapper.lookupIp(ip).catch())?.country) || "";
    }

    const body = NewsletterSignupsSchema.parse({
      email,
      country,
    });

    const data: any = await db
      .select({ count: sql<number>`count(*)` })
      .from(newsletterSignupsTable)
      .where(eq(newsletterSignupsTable.email, email))
      .all();

    if (!data?.[0]?.count || data[0].count === 0) {
      await db.insert(newsletterSignupsTable).values(body).run();
    }
  } catch (error) {
    console.error(error);
    return Response.json({ status: "error" });
  }

  return Response.json({ status: "success" });
}
