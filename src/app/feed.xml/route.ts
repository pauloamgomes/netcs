import assert from "assert";
import { Feed } from "feed";
import { gql } from "graphql-request";

import { contentfulGqlQuery } from "~/lib/contentful";
import { getPageUrl } from "~/lib/navigation";

const queryBlogArticles = gql`
  query queryBlogArticles($preview: Boolean = false) {
    siteSettingsCollection(limit: 1, preview: $preview) {
      items {
        siteName
        authorName
        authorEmail
        seoDescription
      }
    }
    blogArticleCollection(
      order: publishedDate_DESC
      limit: 1000
      preview: $preview
    ) {
      items {
        __typename
        slug
        title
        publishedDate
        summary
      }
    }
    projectCollection(
      order: publishedDate_DESC
      limit: 1000
      preview: $preview
    ) {
      items {
        __typename
        slug
        title
        publishedDate
        summary
      }
    }
  }
`;

export async function GET(req: Request) {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    throw Error("Missing NEXT_PUBLIC_SITE_URL environment variable");
  }

  const data = await contentfulGqlQuery(queryBlogArticles);
  const site = data.siteSettingsCollection.items[0];
  const articles = data.blogArticleCollection.items || [];
  const projects = data.projectCollection.items || [];
  const entries = [...articles, ...projects];

  let author = {
    name: site.authorName,
    email: site.authorEmail,
  };

  let feed = new Feed({
    title: author.name,
    description: site.seoDescription,
    author,
    id: siteUrl,
    link: siteUrl,
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
    },
  });

  for (const entry of entries) {
    const url = getPageUrl(entry);
    let publicUrl = `${siteUrl}${url}`;
    let title = entry.title;
    let date = entry.publishedDate;
    let content = entry.summary;

    assert(typeof title === "string");
    assert(typeof date === "string");
    assert(typeof content === "string");

    feed.addItem({
      title,
      id: publicUrl,
      link: publicUrl,
      content,
      author: [author],
      contributor: [author],
      date: new Date(date),
    });
  }

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      "content-type": "application/xml",
      "cache-control": "s-maxage=31556952",
    },
  });
}
