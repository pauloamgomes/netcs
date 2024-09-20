"use server";

import { draftMode } from "next/headers";

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
  const preview = enforceNoDraft ? false : draftMode().isEnabled;

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
