import { ContentfulLivePreview } from "@contentful/live-preview";

export function previewProps({
  entryId,
  fieldId,
  locale,
}: {
  entryId?: string;
  fieldId?: string;
  locale?: string;
}) {
  if (!entryId || !fieldId) {
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
