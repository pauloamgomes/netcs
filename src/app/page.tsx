import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import BlocksRenderer from "~/components/blocks-renderer";
import { PageHero } from "~/components/hero/hero";
import { queryHomePage, querySiteSettings } from "~/gql/queries";
import { contentfulGqlQuery } from "~/lib/contentful";

// Ondemand revalidation
export const dynamic = "force-static";

export async function generateMetadata(
  _props: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const siteData = await contentfulGqlQuery(querySiteSettings);
  const data = await contentfulGqlQuery(queryHomePage, {
    slug: siteData.siteSettingsCollection.items[0].homepage.slug,
  });
  const page = data.pageCollection.items[0];
  const { siteName } = siteData.siteSettingsCollection.items[0] || {};

  const { seoTitle, seoDescription, seoImage, hero } = page;

  const previousImages: any = (await parent).openGraph?.images || [];

  const images = [];
  if (seoImage?.url) {
    images.push(seoImage.url);
  }

  return {
    title: `${seoTitle || hero.title} | ${siteName}`,
    description: seoDescription || hero?.description.slice(0, 160) || "",
    openGraph: {
      siteName,
      images: [...images, ...previousImages],
    },
  };
}

export default async function Home() {
  const siteData = await contentfulGqlQuery(querySiteSettings);
  const data = await contentfulGqlQuery(queryHomePage, {
    slug: siteData.siteSettingsCollection.items[0].homepage.slug,
  });

  const page = data?.pageCollection?.items?.[0];

  if (!page?.sys.id) {
    return notFound();
  }

  const hero = page?.hero;
  const body = page?.bodyCollection?.items;

  return (
    <main className="flex-auto">
      {hero && <PageHero {...hero} />}
      <BlocksRenderer id={page.sys.id} blocks={body as any} />
    </main>
  );
}
