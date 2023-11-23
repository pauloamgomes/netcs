import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

import { getEntrySlug } from "~/lib/navigation";
import { Maybe, NavigationLinkPage } from "~generated/graphql";

const { NEXT_REVALIDATE_SECRET } = process.env;

const contentTypes: Record<string, string> = {
  page: "Page",
  blogArticle: "BlogArticle",
  project: "Project",
  workExperience: "WorkExperience",
};

export async function POST(request: NextRequest) {
  const headersList = headers();
  const secret = headersList.get("secret");

  const { contentType = "", slug, global = false } = await request.json();

  const entry = {
    __typename: contentTypes[contentType] || "",
    slug,
  };

  const path = getEntrySlug(entry as Maybe<NavigationLinkPage>);

  if ((slug === "homepage" || path) && secret === NEXT_REVALIDATE_SECRET) {
    revalidatePath(`/${path}`);
    return Response.json({ revalidated: true, now: Date.now() });
  }

  if (global && secret === NEXT_REVALIDATE_SECRET) {
    revalidatePath("/", "layout");
    return Response.json({ revalidated: true, now: Date.now() });
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: "Missing path to revalidate",
  });
}
