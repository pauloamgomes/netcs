import {
  BlocksNewsletterSignup,
  BlocksRecentArticles,
  BlocksText,
  BlocksWorkResume,
} from "~generated/graphql";

import { BlockFeaturedProjects } from "./blocks/block-featured-projects";
import { BlockNewsletterSignup } from "./blocks/block-newsletter-signup";
import { BlockRecentArticles } from "./blocks/block-recent-articles";
import { BlockRichText } from "./blocks/block-rich-text";
import { BlockSkills } from "./blocks/block-skills";
import { BlockWorkResume } from "./blocks/block-work-resume";

const Blocks: Record<string, (__0: any) => Promise<JSX.Element>> = {
  BlocksRecentArticles: BlockRecentArticles,
  BlocksNewsletterSignup: BlockNewsletterSignup,
  BlocksWorkResume: BlockWorkResume,
  BlocksText: BlockRichText,
  BlocksFeaturedProjects: BlockFeaturedProjects,
  BlocksSkills: BlockSkills,
};

interface IBlocksSection {
  blocks?:
    | BlocksRecentArticles
    | BlocksWorkResume
    | BlocksNewsletterSignup
    | BlocksText
    | undefined;
}

export default async function BlocksRenderer({ blocks }: IBlocksSection) {
  if (!blocks) {
    return null;
  }

  const elements = [];
  let idx = 1;

  for (const block of Object.values(blocks)) {
    if (Blocks[block?.__typename] !== undefined) {
      const Block = Blocks[block.__typename];
      elements.push(<Block key={`block-${idx++}`} block={block} />);
    } else {
      elements.push(
        <div className="mx-auto my-8 max-w-5xl border border-red-500 p-2">
          Block not found: {block?.__typename}
        </div>
      );
    }
  }

  return <>{elements}</>;
}
