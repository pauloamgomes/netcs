import { ContentfulLivePreview } from "@contentful/live-preview";
import { draftMode } from "next/headers";

export function previewProps({
  entryId,
  fieldId,
  locale,
}: {
  entryId?: string;
  fieldId?: string;
  locale?: string;
}) {
  const enabled = draftMode().isEnabled;

  if (!entryId || !fieldId || !enabled) {
    return {};
  }

  return {
    ...ContentfulLivePreview.getProps({
      entryId,
      fieldId,
      locale: locale || "en-US",
    }),
  };
}
