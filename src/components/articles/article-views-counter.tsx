import { eq, sql } from "drizzle-orm";
import { Maybe } from "graphql/jsutils/Maybe";

import { db } from "~/lib/db";
import { articleViewsTable } from "~/models/schema";

import { EyeIcon } from "../icons";
import { ViewCounterCapture } from "./view-counter-capture";

const pageViewsEnabled = process.env.ARTICLE_PAGE_VIEWS_ENABLED === "true";

export async function ArticlePageViewCounter({
  slug,
}: {
  slug?: Maybe<string>;
}) {
  if (!pageViewsEnabled || !slug) {
    return null;
  }

  const data = await db
    .select({ count: sql<number>`count(*)` })
    .from(articleViewsTable)
    .where(eq(articleViewsTable.slug, slug))
    .all();

  const count = data?.[0]?.count || 0;

  return (
    <>
      <ViewCounterCapture slug={slug} />

      {count ? (
        <div className="text-md flex items-center">
          <EyeIcon className="mr-1.5 inline-block h-4 w-4" />
          {count} views
        </div>
      ) : null}
    </>
  );
}
