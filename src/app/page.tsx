import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { queryHomePage, querySiteSettings } from "~/gql/queries";
import { contentfulGqlQuery } from "~/lib/contentful";
import { PageTemplate } from "~/templates";

export const revalidate = parseInt(process.env.NEXT_REVALIDATE_SECONDS || "3600", 10); // 60 minutes
export const fetchCache = process.env.NODE_ENV === 'production' ? 'force-cache' : 'force-no-store';

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

  const title = page?.hero?.title || "";
  const description = page?.hero?.description?.slice(0, 160) || "";

  // Use the page's SEO settings if they exist, otherwise use the defaults
  const { seoTitle, seoDescription, seoImage } = page;

  const images = [];
  if (seoImage?.url) {
    images.push(seoImage.url);
  }

  const previousImages: any = (await parent).openGraph?.images || [];

  return {
    title: `${seoTitle || title} | ${siteName}`,
    description: seoDescription || description || "",
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

  if (!data?.pageCollection?.items?.[0]?.sys?.id) {
    return notFound();
  }

  return <PageTemplate page={data.pageCollection.items[0]} />;
}
