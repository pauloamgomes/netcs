import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SearchInput } from "~/components/articles/search-input";
import BlocksRenderer from "~/components/blocks-renderer";
import { Card } from "~/components/card";
import { CategoryBadge } from "~/components/category-badge";
import { Container } from "~/components/container";
import { PageHero } from "~/components/hero/hero";
import { Pagination } from "~/components/pagination";
import { Sort } from "~/components/sort";
import { queryArticles, queryPage } from "~/gql/queries";
import { contentfulGqlQuery } from "~/lib/contentful";
import { contentfulImgUrl } from "~/lib/image";
import { getPageUrl } from "~/lib/navigation";
import { previewProps } from "~/lib/preview";
import { formatDate } from "~/lib/utils";
import { BlogArticle, Category } from "~generated/graphql";

// Ondemand revalidation
export const revalidate = process.env.NODE_ENV === "production" ? false : 0;

type PageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const PER_PAGE = 9;

export async function generateMetadata(
  { params: { slug } }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const images = [];

  const data = await contentfulGqlQuery(queryPage, {
    slug,
    template: "Articles",
  });

  const page = data?.pageCollection.items[0];

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

export default async function ArticlesPage({
  params: { slug },
  searchParams,
}: PageProps) {
  const pageData = await contentfulGqlQuery(queryPage, {
    slug,
    template: "Articles",
  });

  if (!pageData?.pageCollection?.items?.[0]?.sys?.id) {
    return notFound();
  }

  const page = pageData.pageCollection.items[0];

  if (!page?.sys.id) {
    return null;
  }

  const skip =
    (searchParams?.page ? parseInt(searchParams.page as string) : 1) *
      PER_PAGE -
    PER_PAGE;

  const sort = searchParams?.sort === "ASC" ? "ASC" : "DESC";
  const search = (searchParams?.search as string) || null;
  const topic = (searchParams?.topic as string) || null;

  const data = await contentfulGqlQuery(queryArticles, {
    limit: PER_PAGE,
    skip,
    order: `publishedDate_${sort}`,
    topic,
    search,
  });

  const categories = data?.categoryCollection?.items || [];
  const articles = data?.blogArticleCollection?.items || [];
  const totalArticles = data?.blogArticleCollection?.total || 0;

  const hero = page?.hero;
  const body = page?.bodyCollection?.items;

  const totalPages = Math.ceil(totalArticles / PER_PAGE);
  const currPage = searchParams?.page
    ? parseInt(searchParams.page as string)
    : 1;

  const category = categories.find(({ slug }: Category) => slug === topic);

  let title = `${totalArticles} articles found`;
  if (category) {
    title = `${totalArticles} articles found in ${category.title}`;
  }
  if (category && search) {
    title = `${totalArticles} articles found in ${category.title} for "${search}"`;
  } else if (search && totalArticles) {
    title = `${totalArticles} articles found for "${search}"`;
  } else if (search && !totalArticles) {
    title = `No articles found for "${search}"`;
  }

  return (
    <main className="flex-auto">
      {hero && <PageHero {...hero} />}

      <Container className="mx-auto mt-8 mb-20">
        <div className="flex justify-between items-center mb-6 z-20 flex-wrap gap-y-4">
          <div>
            <h2 className="text-lg lg:text-xl">{title}</h2>
            {category ? (
              <Link className="btn btn-xs btn-link" href="/articles">
                view all topics
              </Link>
            ) : null}
          </div>

          <div className="flex w-full max-w-md">
            <SearchInput defaultSearch={search || ""} />
            <Sort className="ml-2" active={sort} />
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 z-0">
          {articles.map((article: BlogArticle) => (
            <Card
              as="li"
              key={article.sys.id}
              {...previewProps({
                entryId: article.sys.id,
                fieldId: "title",
              })}
            >
              <Card.Image
                url={contentfulImgUrl(article.featuredImage, {
                  width: 600,
                  height: 360,
                  fit: "fill",
                })}
                alt={article.featuredImage?.title}
              />
              <Card.Title href={getPageUrl(article)}>
                {article.title}
              </Card.Title>
              <Card.SubTitle className="text-xs justify-between">
                <span>{formatDate(article.publishedDate)}</span>
                <CategoryBadge
                  category={
                    article.categoriesCollection?.items?.[0] as Category
                  }
                  className="text-xs"
                />
              </Card.SubTitle>
              <Card.Description height="sm">{article.summary}</Card.Description>
              <Card.Cta>view more</Card.Cta>
            </Card>
          ))}
        </ul>

        <div className="mx-auto max-w-sm mt-16">
          <Pagination totalPages={totalPages} currPage={currPage} />
        </div>
      </Container>

      <BlocksRenderer blocks={body as any} />
    </main>
  );
}