import { gql } from "graphql-request";
import { MetadataRoute } from "next";

import { contentfulGqlQuery } from "~/lib/contentful";
import { getPageUrl } from "~/lib/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const querySitemapEntries = gql`
  query querySitemapEntries($limit: Int = 1000) {
    blogArticleCollection(limit: $limit) {
      items {
        __typename
        sys {
          id
          publishedAt
        }
        slug
      }
    }
    projectCollection(limit: $limit) {
      items {
        __typename
        sys {
          id
          publishedAt
        }
        slug
      }
    }
    workExperienceCollection(limit: $limit) {
      items {
        __typename
        sys {
          id
          publishedAt
        }
        slug
      }
    }
    pageCollection(limit: $limit) {
      items {
        __typename
        sys {
          id
          publishedAt
        }
        slug
      }
    }
  }
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await contentfulGqlQuery(querySitemapEntries);

  const entries = [
    ...data.pageCollection.items,
    ...data.blogArticleCollection.items,
    ...data.projectCollection.items,
    ...data.workExperienceCollection.items,
  ]?.filter((entry) => entry?.slug);

  return [
    ...entries.map((entry) => {
      return {
        url: `${SITE_URL}${getPageUrl(entry) || "/"}`,
        lastModified: entry.sys.publishedAt,
      };
    }),
  ];
}
