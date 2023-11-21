import { Maybe } from "graphql/jsutils/Maybe";

import { previewProps } from "~/lib/preview";

import { ClockIcon } from "../icons";

export function ArticleReadingTime({
  id,
  readingTime,
}: {
  id: string;
  readingTime?: Maybe<string>;
}) {
  if (!readingTime) {
    return null;
  }

  return (
    <div
      {...previewProps({
        entryId: id,
        fieldId: "readingTime",
      })}
      className="text-md flex items-center"
    >
      <ClockIcon className="mr-1.5 inline-block h-4 w-4" />
      {readingTime}
    </div>
  );
}
