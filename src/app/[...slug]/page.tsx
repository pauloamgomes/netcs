import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import BlocksRenderer from "~/components/blocks-renderer";
import { PageHero } from "~/components/hero/hero";
import { getAllPages, getPage, getSiteGlobalSettings } from "~/lib/contentful";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  const siteData = await getSiteGlobalSettings(true);
  const pages = await getAllPages(true);

  return pages
    ?.filter(
      (page) =>
        // Do not build homepage as it's already done
        page.slug !== siteData.homepage?.slug
    )
    .map((page) => ({
      slug: [page.slug],
    }));
}

export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;

  const page = await getPage({ slug: params.slug.join("/"), template: "Page" });

  if (!page?.sys) {
    return {};
  }

  const { seoTitle, seoDescription, seoImage, hero } = page;

  const previousImages: any = (await parent).openGraph?.images || [];

  const images = [];

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

export default async function BasicPage(props: PageProps) {
  const params = await props.params;

  const page = await getPage({ slug: params.slug.join("/"), template: "Page" });

  if (!page?.sys.id) {
    return notFound();
  }

  return (
    <main className="flex-auto">
      {page.hero && <PageHero {...page.hero} />}
      <BlocksRenderer
        id={page.sys.id}
        blocks={page?.bodyCollection?.items as any}
      />
    </main>
  );
}
