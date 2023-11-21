"use server";

import { GraphQLClient, Variables } from "graphql-request";
import { draftMode } from "next/headers";
import { cache } from "react";

import { sleep } from "./utils";

const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT_ID,
  CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  NEXT_REVALIDATE_SECONDS,
} = process.env;

const revalidate = parseInt(NEXT_REVALIDATE_SECONDS || "600", 10);

const apiUrl = `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT_ID}`;

const defaultClient = new GraphQLClient(apiUrl, {
  fetch: cache(async (url: any, params: RequestInit | undefined) =>
    fetch(url, { ...params, next: { revalidate } })
  ),
});

const previewClient = new GraphQLClient(apiUrl, {
  fetch: cache(async (url: any, params: RequestInit | undefined) =>
    fetch(url, { ...params, cache: "no-store" })
  ),
});

export async function contentfulGqlQuery(query: string, variables?: Variables) {
  const preview = draftMode().isEnabled;

  const client = preview ? previewClient : defaultClient;

  client.setHeader(
    "Authorization",
    `Bearer ${
      preview ? CONTENTFUL_PREVIEW_ACCESS_TOKEN : CONTENTFUL_ACCESS_TOKEN
    }`
  );

  if (preview) {
    variables = { ...(variables || {}), preview };
  }

  let data: any = null;

  try {
    data = await client.request(query, variables);
  } catch (err: any) {
    if (err?.response?.status === 429) {
      console.info(
        "[GRAPHQL_ERROR] Rate limit exceeded, retrying in 1 second..."
      );
      await sleep(1);
      data = await contentfulGqlQuery(query, variables);
    } else {
      err?.response?.errors?.forEach((error: any) => {
        console.error(
          `[GRAPHQL_ERROR]`,
          error?.message,
          error?.locations ?? ""
        );
      });
      data = err?.response?.data;
    }
  }

  return data;
}
