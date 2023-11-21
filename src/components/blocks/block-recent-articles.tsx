import { gql } from "graphql-request";
import Link from "next/link";

import { FragmentAsset } from "~/gql/fragments";
import { contentfulGqlQuery } from "~/lib/contentful";
import { contentfulImgUrl } from "~/lib/image";
import { getPageUrl } from "~/lib/navigation";
import { previewProps } from "~/lib/preview";
import { BlocksRecentArticles, BlogArticle } from "~generated/graphql";

import { Card } from "../card";
import { Container } from "../container";
import { SectionHeading } from "../heading";
import { ChevronRightIcon } from "../icons";

const queryBlockRecentArticles = gql`
  ${FragmentAsset}

  query queryBlockRecentArticles($limit: Int = 3, $preview: Boolean = false) {
    blogArticleCollection(
      limit: $limit
      order: publishedDate_DESC
      preview: $preview
    ) {
      items {
        __typename
        sys {
          id
        }
        title
        slug
        publishedDate
        summary
        featuredImage {
          ...FragmentAsset
        }
      }
    }
  }
`;

export async function BlockRecentArticles({
  block,
}: {
  block: BlocksRecentArticles;
}) {
  const { title, summary, maxArticlesToDisplay = 3, viewAllPage } = block;
  const data = await contentfulGqlQuery(queryBlockRecentArticles, {
    limit: maxArticlesToDisplay,
  });
  const articles = data?.blogArticleCollection?.items || [];
  const viewAllPageUrl = getPageUrl(viewAllPage);

  return (
    <Container className="mx-auto py-16">
      <SectionHeading id={block.sys.id} title={title} summary={summary} />

      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
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
            <Card.Title href={getPageUrl(article)}>{article.title}</Card.Title>
            <Card.Description height="sm">{article.summary}</Card.Description>
            <Card.Cta>view more</Card.Cta>
          </Card>
        ))}
      </ul>
      {viewAllPageUrl && (
        <div
          {...previewProps({
            entryId: block.sys.id,
            fieldId: "viewAllPageUrl",
          })}
          className="text-center mt-8"
        >
          <Link href={viewAllPageUrl} className="btn btn-ghost btn-md">
            View all articles
            <ChevronRightIcon className="h-4 w-4 stroke-current" />
          </Link>
        </div>
      )}
    </Container>
  );
}
