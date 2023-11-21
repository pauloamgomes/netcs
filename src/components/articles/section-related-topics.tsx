import { Category, Maybe } from "~generated/graphql";

import { CategoryBadge } from "../category-badge";

export async function SectionRelatedTopics({
  topics,
}: {
  topics?: Maybe<Category>[];
}) {
  if (!topics?.length) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl mt-12">
      <h2 className="text-2xl">Related Topics:</h2>
      <div className="flex flex-wrap mt-4">
        {topics?.map((category) => (
          <CategoryBadge
            url={`/articles?topic=${category?.slug}`}
            key={category?.sys.id}
            category={category}
          />
        ))}
      </div>
    </div>
  );
}
