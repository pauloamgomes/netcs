import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import BlocksRenderer from "~/components/blocks-renderer";
import { PageHero } from "~/components/hero/hero";
import { queryAllPages, queryPage } from "~/gql/queries";
import { contentfulGqlQuery } from "~/lib/contentful";
import { Page } from "~generated/graphql";

// Ondemand revalidation
export const revalidate = process.env.NODE_ENV === "production" ? false : 0;

type PageProps = {
  params: { slug: string[] };
};

export async function generateStaticParams() {
  const data = await contentfulGqlQuery(
    queryAllPages,
    { template: "Page" },
    true
  );

  return data?.pageCollection.items.map(({ slug }: { slug: string }) => ({
    slug: [slug],
  }));
}

export async function generateMetadata(
  { params: { slug } }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const images = [];

  const data = await contentfulGqlQuery(queryPage, {
    slug: slug.join("/"),
    template: "Page",
  });

  const page = data?.pageCollection.items[0] as Page;

  if (!page?.sys.id) {
    return {};
  }

  const { seoTitle, seoDescription, seoImage, hero } = page;

  const previousImages: any = (await parent).openGraph?.images || [];

  if (seoImage?.url) {
    images.unshift(seoImage.url);
  }

  return {
    title: seoTitle || hero?.title || "",
    description: seoDescription || hero?.description?.slice(0, 160) || "",
    openGraph: {
      images: [...images, ...previousImages],
    },
  };
}

export default async function BasicPage({ params: { slug } }: PageProps) {
  const data = await contentfulGqlQuery(queryPage, {
    slug: slug.join("/"),
    template: "Page",
  });

  const page = data.pageCollection.items[0];

  if (!page?.sys.id) {
    return notFound();
  }

  return (
    <main className="flex-auto">
      {page.hero && <PageHero {...page.hero} />}
      <BlocksRenderer blocks={page?.bodyCollection?.items as any} />
    </main>
  );
}
