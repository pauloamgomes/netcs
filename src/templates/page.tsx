import { notFound } from "next/navigation";

import BlocksRenderer from "~/components/blocks-renderer";
import { PageHero } from "~/components/hero/hero";
import { Page } from "~generated/graphql";

export async function PageTemplate({ page }: { page: Page | undefined }) {
  if (!page?.sys.id) {
    return notFound();
  }

  const hero = page?.hero;
  const body = page?.bodyCollection?.items;

  return (
    <main className="flex-auto">
      {hero && <PageHero {...hero} />}
      <BlocksRenderer blocks={body as any} />
    </main>
  );
}
