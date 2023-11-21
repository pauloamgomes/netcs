import clsx from "clsx";
import { gql } from "graphql-request";

import {
  FragmentAccordion,
  FragmentAsset,
  FragmentCodeSnippet,
  FragmentInfoMessage,
  FragmentMedia,
  FragmentText,
} from "~/gql/fragments";
import { contentfulGqlQuery } from "~/lib/contentful";
import { previewProps } from "~/lib/preview";
import { RichText } from "~/lib/rich-text";
import { BlocksText } from "~generated/graphql";

import { Container } from "../container";
import { richTextEmbeddedBlocks } from "../richtext-embedded-blocks";

const richTextQuery = gql`
  ${FragmentAsset}
  ${FragmentText}
  ${FragmentCodeSnippet}
  ${FragmentMedia}
  ${FragmentInfoMessage}
  ${FragmentAccordion}

  query richTextQuery($id: String!, $preview: Boolean = false) {
    blocksText(id: $id, preview: $preview) {
      sys {
        id
      }
      text {
        json
        links {
          assets {
            block {
              ...FragmentAsset
            }
          }
          entries {
            block {
              __typename
              ... on CodeSnippet {
                ...FragmentCodeSnippet
              }
              ... on Media {
                ...FragmentMedia
              }
              ... on InfoMessage {
                ...FragmentInfoMessage
              }
              ... on Accordion {
                ...FragmentAccordion
              }
            }
            hyperlink {
              __typename
              ... on Page {
                sys {
                  id
                }
                slug
              }
              ... on BlogArticle {
                sys {
                  id
                }
                slug
              }
              ... on Project {
                sys {
                  id
                }
                slug
              }
              ... on WorkExperience {
                sys {
                  id
                }
                slug
              }
            }
          }
        }
      }
    }
  }
`;

export async function BlockRichText({ block }: { block: BlocksText }) {
  const data = await contentfulGqlQuery(richTextQuery, { id: block.sys.id });
  const embeddedBlocks = await richTextEmbeddedBlocks()

  return (
    <div
      className={clsx(
        "mw-full pt-2 pb-8",
        block?.backgroundColor === "Light" && "bg-base-200"
      )}
    >
      <Container className="mx-auto max-w-5xl my-20">
        <div
          {...previewProps({
            entryId: block.sys.id,
            fieldId: "cta",
          })}
          className="prose prose-lg max-w-none prose-table:text-md"
        >
          <RichText document={data?.blocksText?.text} blocks={embeddedBlocks} />
        </div>
      </Container>
    </div>
  );
}
