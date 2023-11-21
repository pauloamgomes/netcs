import { previewProps } from "~/lib/preview";
import { Accordion as IAccordion,Asset, CodeSnippet, InfoMessage as IInfoMessage, Media } from "~generated/graphql";

import { Accordion } from "./accordion";
import { AssetBlock } from "./asset";
import { CodeBlock } from "./code";
import { InfoMesssage } from "./info-message";
import { MediaBlock } from "./media";

export async function richTextEmbeddedBlocks() {
  return {
    Asset: (asset: Asset) => <AssetBlock asset={asset} />,
    CodeSnippet: (codeSnippet: CodeSnippet) => (
      <div
        {...previewProps({
          entryId: codeSnippet?.sys?.id,
          fieldId: "snippet",
        })}
      >
        <CodeBlock
          id={codeSnippet?.sys?.id}
          language={codeSnippet?.snippet?.language}
          snippet={codeSnippet?.snippet?.code}
          caption={codeSnippet?.caption}
        />
      </div>
    ),
    Media: (media: Media) => (
      <div
        {...previewProps({
          entryId: media.sys.id,
          fieldId: "title",
        })}
      >
        <MediaBlock {...media} />
      </div>
    ),
    InfoMessage: (infoMessage: IInfoMessage) => (
      <InfoMesssage {...infoMessage} />
    ),
    Accordion: (accordion: IAccordion) => (
      <div
        {...previewProps({
          entryId: accordion.sys.id,
          fieldId: "items",
        })}
      >
        <Accordion items={accordion?.itemsCollection?.items} />
      </div>
    ),
  };
}