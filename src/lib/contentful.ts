"use server";

import { draftMode } from "next/headers";

import {
  queryAllArticles,
  queryAllPages,
  queryArticles,
  queryBlogArticle,
  queryGlobalSiteSettings,
  queryPage,
  queryProject,
  queryProjects,
  queryWorkExperience,
  queryWorks,
} from "~/gql/queries";
import { BlogArticle, Category, Page, SiteSettings } from "~generated/graphql";

import { compress } from "./compress";
import { sleep } from "./utils";

const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT_ID,
  CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  NODE_ENV,
} = process.env;

const apiUrl = `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT_ID}`;

export async function contentfulGqlQuery(
  query: string,
  variables = {} as Record<string, unknown>,
  enforceNoDraft = false
) {
  const preview = enforceNoDraft ? false : (await draftMode()).isEnabled;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${
        preview ? CONTENTFUL_PREVIEW_ACCESS_TOKEN : CONTENTFUL_ACCESS_TOKEN
      }`,
    },
    body: JSON.stringify({
      query: compress(query),
      variables: { ...variables, preview },
    }),
    next: { revalidate: preview || NODE_ENV !== "production" ? 0 : false },
  });

  if (res?.status === 429) {
    console.info(
      "[GRAPHQL_ERROR] Rate limit exceeded, retrying in 1 second..."
    );
    await sleep(1);
    return await contentfulGqlQuery(query, variables);
  }

  const { data, errors } = await res?.json();

  errors?.forEach((error: any) => {
    console.error(`[GRAPHQL_ERROR]`, error?.message, error?.extensions ?? "");
  });

  return data;
}

export async function getPage({
  slug,
  template,
}: {
  slug: string;
  template: string;
}): Promise<Page> {
  const data = await contentfulGqlQuery(queryPage, {
    slug,
    template,
  });

  return data.pageCollection?.items[0];
}

export async function getAllPages(enforceNoDraft = false): Promise<Page[]> {
  const data = await contentfulGqlQuery(
    queryAllPages,
    { template: "Page" },
    enforceNoDraft
  );

  return data?.pageCollection.items;
}

export async function getSiteGlobalSettings(
  enforceNoDraft = false
): Promise<SiteSettings> {
  const data = await contentfulGqlQuery(
    queryGlobalSiteSettings,
    {},
    enforceNoDraft
  );

  return data?.siteSettingsCollection?.items?.[0] || {};
}

export async function getLatestArticles(
  { limit = 9 }: { limit?: number },
  enforceNoDraft = false
): Promise<BlogArticle[]> {
  const data = await contentfulGqlQuery(
    queryAllArticles,
    {
      limit,
      order: "publishedDate_DESC",
    },
    enforceNoDraft
  );

  return data?.blogArticleCollection?.items;
}

export async function getArticles({
  limit,
  skip,
  order,
  topic,
  search,
}: {
  limit: number;
  skip: number;
  order: "publishedDate_ASC" | "publishedDate_DESC";
  topic: string | null;
  search: string | null;
}): Promise<{
  categories: Category[];
  articles: BlogArticle[];
  totalArticles: number;
}> {
  const data = await contentfulGqlQuery(queryArticles, {
    limit,
    skip,
    order,
    topic,
    search,
  });

  const categories: Category[] = data?.categoryCollection?.items || [];
  const articles: BlogArticle[] = data?.blogArticleCollection?.items || [];
  const totalArticles = data?.blogArticleCollection?.total || 0;

  return {
    categories,
    articles,
    totalArticles,
  };
}

export async function getProjects(enforceNoDraft = false) {
  const data = await contentfulGqlQuery(queryProjects, {}, enforceNoDraft);

  return data?.projectCollection?.items;
}

export async function getProject({ slug }: { slug: string }) {
  const data = await contentfulGqlQuery(queryProject, {
    slug,
  });

  return data?.projectCollection?.items[0];
}

export async function getBlogArticle({ slug }: { slug: string }) {
  const data = await contentfulGqlQuery(queryBlogArticle, {
    slug,
  });

  return data?.blogArticleCollection.items[0];
}

export async function getWorks(enforceNoDraft = false) {
  const data = await contentfulGqlQuery(queryWorks, {}, enforceNoDraft);

  return data?.workExperienceCollection?.items || [];
}

export async function getWork({ slug }: { slug: string }) {
  const data = await contentfulGqlQuery(queryWorkExperience, {
    slug,
  });

  return data?.workExperienceCollection.items[0];
}
