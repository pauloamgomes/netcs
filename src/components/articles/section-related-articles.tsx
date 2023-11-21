import { gql } from "graphql-request";

import { contentfulGqlQuery } from "~/lib/contentful";
import { getPageUrl } from "~/lib/navigation";
import { BlogArticle, Category, Maybe } from "~generated/graphql";

import { Card } from "../card";

const queryRelatedArticles = gql`
  query queryRelatedArticles(
    $limit: Int = 4
    $topics: [String]
    $exclude: [String]
    $preview: Boolean = false
  ) {
    blogArticleCollection(
      limit: $limit
      order: publishedDate_DESC
      where: {
        AND: [{ categories: { slug_in: $topics } }, { slug_not_in: $exclude }]
      }
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
      }
    }
  }
`;

export async function SectionRelatedArticles({
  categories,
  exclude = [],
}: {
  categories?: Maybe<Category>[];
  exclude?: string[];
}) {
  const topics = categories?.map(
    (category) => category?.slug as string
  ) as string[];

  const data = await contentfulGqlQuery(queryRelatedArticles, {
    limit: 4,
    topics,
    exclude,
  });

  const articles = data?.blogArticleCollection?.items || [];

  if (!articles.length) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl mt-12">
      <h2 className="text-2xl">Related Articles:</h2>
      <div className="flex flex-wrap mt-4">
        <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2 xl:gap-x-8">
          {articles.map((article: BlogArticle) => (
            <Card as="li" key={article.sys.id} className="pb-4">
              <Card.Title href={getPageUrl(article)}>
                {article.title}
              </Card.Title>
              <Card.Description height="sm">{article.summary}</Card.Description>
            </Card>
          ))}
        </ul>
      </div>
    </div>
  );
}
