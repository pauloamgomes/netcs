import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

import { contentfulGqlQuery } from "~/lib/contentful";
import { getEntrySlug } from "~/lib/navigation";
import { Maybe, NavigationLinkPage } from "~generated/graphql";

const { NEXT_REVALIDATE_SECRET } = process.env;

const contentTypes: Record<string, string> = {
  page: "Page",
  blogArticle: "BlogArticle",
  project: "Project",
  workExperience: "WorkExperience",
};

async function resolveEntryPathEntry({
  contentType,
  slug,
}: {
  contentType: string;
  slug?: string;
}) {
  const typename = contentTypes[contentType];

  if (!typename || !slug) {
    return null;
  }

  const entry = await contentfulGqlQuery(
    `
      query EntryPath($slug: String!, $preview: Boolean!) {
        ${typename}Collection(limit: 1, where: { slug: $slug }) {
          items {
            __typename
            slug
          }
        }
      }
    `,
    { slug }
  );

  const items = entry?.[`${typename}Collection`]?.items || [];
  return (items[0] as Maybe<NavigationLinkPage>) ?? null;
}

export async function POST(request: NextRequest) {
  const headersList = await headers();
  const secret = headersList.get("secret");

  const { contentType = "", slug, global = false } = await request.json();

  if (secret !== NEXT_REVALIDATE_SECRET) {
    return Response.json(
      {
        revalidated: false,
        now: Date.now(),
        message: "Invalid secret",
      },
      { status: 401 }
    );
  }

  const entry = await resolveEntryPathEntry({ contentType, slug });

  const path = getEntrySlug(entry);

  if (slug === "homepage" || path) {
    revalidatePath(`/${path}`);
    return Response.json({ revalidated: true, now: Date.now() });
  }

  if (global) {
    revalidatePath("/", "layout");
    return Response.json({ revalidated: true, now: Date.now() });
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: "Missing path to revalidate",
  });
}
