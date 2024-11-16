import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { ArticleReadingTime } from "~/components/articles/article-reading-time";
import { ArticlePageViewCounter } from "~/components/articles/article-views-counter";
import { SectionReferencesAndResources } from "~/components/articles/section-references";
import { SectionRelatedArticles } from "~/components/articles/section-related-articles";
import { SectionRelatedTopics } from "~/components/articles/section-related-topics";
import { Container } from "~/components/container";
import { PageHero } from "~/components/hero/hero";
import { richTextEmbeddedBlocks } from "~/components/richtext-embedded-blocks";
import { getBlogArticle, getLatestArticles } from "~/lib/contentful";
import { previewProps } from "~/lib/preview";
import { RichText } from "~/lib/rich-text";
import { formatDate, slugify } from "~/lib/utils";
import { BlogArticle, PageHero as IPageHero } from "~generated/graphql";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

// Only generate article pages during build time for the latest 9 articles found in first page
export async function generateStaticParams() {
  const pages = await getLatestArticles({ limit: 9 }, true);

  return pages.map((page: BlogArticle) => ({
    slug: [page.slug],
  }));
}

export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;

  const article = await getBlogArticle({ slug: params.slug.join("/") });

  if (!article?.sys.id) {
    return {};
  }

  const previousImages: any = (await parent).openGraph?.images || [];

  const images = [];

  if (article?.featuredImage?.url) {
    images.push(article.featuredImage.url);
  }

  const { seoTitle, seoDescription, seoImage, title, summary } = article;

  if (seoImage?.url) {
    images.unshift(seoImage.url);
  }

  return {
    title: seoTitle || title,
    description: seoDescription || summary,
    openGraph: {
      images: [...images, ...previousImages],
    },
  };
}

export default async function ArticlePage(props: PageProps) {
  const params = await props.params;

  const article = await getBlogArticle({ slug: params.slug.join("/") });

  if (!article?.sys.id) {
    return notFound();
  }

  const embeddedBlocks = await richTextEmbeddedBlocks();

  const heroProps = {
    sys: article.sys,
    title: article.title,
    description: article.summary,
    variant: "image-left",
    image: article.featuredImage,
    minHeight: "25%",
    variantColor: "Primary",
  } as IPageHero;

  const content = article?.body?.json?.content || [];

  for (let i = 0; i < content.length; i++) {
    const node = content[i];
    if (node.nodeType === "heading-2" && node?.content?.[0]?.value) {
      const slug = slugify(node.content[0].value);
      content[i].data = {
        ...node.data,
        slug,
      };
    }
  }

  return (
    <main className="article flex-auto">
      <PageHero {...heroProps} />

      <Container className="bg-primary w-full pb-6">
        <div className="mx-auto max-w-3xl order-first flex items-center justify-between font-semibold text-white">
          <time dateTime={article.publishedDate} className="flex items-center">
            <span>{formatDate(article.publishedDate)}</span>
          </time>
          <div className="flex items-center gap-x-4">
            <ArticlePageViewCounter slug={article.slug} />
            <ArticleReadingTime
              id={article.sys.id}
              readingTime={article.readingTime?.text}
            />
          </div>
        </div>
      </Container>

      <Container className="mt-12 mb-24">
        <div
          {...previewProps({
            entryId: article.sys.id,
            fieldId: "body",
          })}
          className="mx-auto max-w-3xl prose"
        >
          <RichText document={article?.body} blocks={embeddedBlocks} />
        </div>

        <div className="divider my-16" />

        <SectionReferencesAndResources
          links={article?.referencesAndResourcesCollection?.items}
        />

        <SectionRelatedTopics topics={article?.categoriesCollection?.items} />

        <SectionRelatedArticles
          exclude={[article?.slug as string]}
          categories={article?.categoriesCollection?.items}
        />
      </Container>
    </main>
  );
}
