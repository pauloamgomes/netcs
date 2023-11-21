import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import {
  AssetLinkBlock,
  BLOCKS,
  EntryHyperlink,
  INLINES,
  MARKS,
} from "@contentful/rich-text-types";
import Link from "next/link";
import { ReactNode } from "react";

import { HeadingLink } from "~/components/heading-link";

import { getPageUrl } from "./navigation";
import { IRichText } from "./types";

interface INodeWithSlug extends Node {
  data: {
    slug?: string;
  };
}

const RICHTEXT_MARKS_OPTIONS: any = {
  renderMark: {
    [MARKS.BOLD]: (text: ReactNode) => <b>{text}</b>,
    [MARKS.ITALIC]: (text: ReactNode) => <i>{text}</i>,
    [MARKS.UNDERLINE]: (text: ReactNode) => <u>{text}</u>,
    [MARKS.CODE]: (text: ReactNode) => <code>{text}</code>,
  },
  renderNode: {
    [BLOCKS.HEADING_2]: (_node: INodeWithSlug, children: ReactNode) =>
      _node?.data?.slug ? (
        <HeadingLink slug={_node.data.slug}>{children}</HeadingLink>
      ) : (
        <h2>{children}</h2>
      ),
    [BLOCKS.PARAGRAPH]: (_node: Node, children: ReactNode) => <p>{children}</p>,
    [BLOCKS.UL_LIST]: (_node: Node, children: ReactNode) => <ul>{children}</ul>,
    [BLOCKS.OL_LIST]: (_node: Node, children: ReactNode) => <ol>{children}</ol>,
    [BLOCKS.LIST_ITEM]: (_node: Node, children: ReactNode) => (
      <li>{children}</li>
    ),
    [BLOCKS.HR]: () => <hr className="h-1 w-full border-0" />,
    [BLOCKS.TABLE]: (_node: Node, children: ReactNode) => (
      <div className="overflow-x-auto">
        <table className="table">
          <tbody>{children}</tbody>
        </table>
      </div>
    ),
    [INLINES.HYPERLINK]: (node: any, children: ReactNode) => {
      if (node?.nodeType === "hyperlink" && node?.data?.uri) {
        return (
          <a
            href={node.data.uri}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        );
      }

      return children;
    },
  },
};

function renderOptions(links: any = {}, entryBlocks: any = {}) {
  const hyperlinkMap = new Map();

  if (links?.entries?.hyperlink) {
    for (const entry of links.entries.hyperlink) {
      if (entry?.sys?.id) {
        hyperlinkMap.set(entry?.sys?.id, entry);
      }
    }
  }

  if (links?.entries?.block) {
    for (const entry of links.entries.block) {
      if (entry?.sys?.id) {
        hyperlinkMap.set(entry?.sys?.id, entry);
      }
    }
  }

  if (links?.entries?.inline) {
    for (const entry of links.entries.inline) {
      if (entry?.sys?.id) {
        hyperlinkMap.set(entry?.sys?.id, entry);
      }
    }
  }

  if (links?.assets?.block) {
    for (const asset of links.assets.block) {
      if (asset?.sys?.id) {
        hyperlinkMap.set(asset?.sys?.id, asset);
      }
    }
  }

  return {
    renderMark: RICHTEXT_MARKS_OPTIONS.renderMark,
    renderNode: {
      ...RICHTEXT_MARKS_OPTIONS.renderNode,
      [INLINES.ENTRY_HYPERLINK]: (
        node: EntryHyperlink,
        children: ReactNode
      ) => {
        const entry = hyperlinkMap.get(node?.data?.target?.sys?.id);

        const slug = getPageUrl(entry);

        if (slug) {
          return (
            <Link href={slug}>
              <>{children}</>
            </Link>
          );
        }

        return <>{children}</>;
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node: EntryHyperlink) => {
        const entry = hyperlinkMap.get(node?.data?.target?.sys?.id);

        if (
          Object.prototype.hasOwnProperty.call(entryBlocks, entry?.__typename)
        ) {
          return entryBlocks?.[entry.__typename]?.(entry);
        }
      },
      [INLINES.EMBEDDED_ENTRY]: (node: EntryHyperlink) => {
        const entry = hyperlinkMap.get(node?.data?.target?.sys?.id);

        if (
          Object.prototype.hasOwnProperty.call(entryBlocks, entry?.__typename)
        ) {
          return entryBlocks?.[entry.__typename]?.(entry);
        }
      },
      [BLOCKS.EMBEDDED_ASSET]: (node: AssetLinkBlock) => {
        const asset = hyperlinkMap.get(node?.data?.target?.sys?.id);
        if (
          Object.prototype.hasOwnProperty.call(entryBlocks, asset?.__typename)
        ) {
          return entryBlocks?.[asset.__typename]?.(asset);
        }
      },
    },
  };
}

export function RichText({ document, blocks = {} }: IRichText) {
  if (!document?.json) {
    return null;
  }

  const { json, links } = document;

  const options = renderOptions(links, {
    ...blocks,
  });

  return <>{documentToReactComponents(json, options)}</>;
}
