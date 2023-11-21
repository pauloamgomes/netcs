import { Asset, Maybe } from "~generated/graphql";

interface IImageOptions {
  aspectRatio?: string;
  format?: "jpg" | "png" | "webp" | "gif" | "avif";
  width?: number;
  height?: number;
  fit?: "pad" | "fill" | "scale" | "crop" | "thumb";
  focalPoint?:
    | "face"
    | "faces"
    | "center"
    | "top"
    | "right"
    | "left"
    | "bottom"
    | "top_right"
    | "top_left"
    | "bottom_right"
    | "bottom_left";
  radius?: number | "max";
  quality?: number;
}

export const parseAspectRatio = (ar = "16:9") => {
  const [w, h] = ar.split(":");
  return Number(h) / Number(w);
};

export function contentfulImgUrl(
  asset: Maybe<Asset> | undefined,
  options?: IImageOptions
) {
  if (!asset?.url) {
    return "/images/placeholder.png";
  }

  if (asset.contentType?.includes("svg")) {
    return asset.url;
  }

  const { aspectRatio, format, fit, focalPoint, radius, quality } =
    options || {};

  const url = new URL(asset.url);

  const width = options?.width || asset.width;
  const height = options?.height || asset.height;

  if (width) {
    url.searchParams.set("w", width.toString());
  }

  if (height) {
    url.searchParams.set("h", height.toString());
  }

  if (width && aspectRatio) {
    url.searchParams.set(
      "h",
      Math.round(width * parseAspectRatio(aspectRatio)).toString()
    );
  }

  if (quality) {
    url.searchParams.set("q", quality.toString());
  }

  if (format) {
    url.searchParams.set("fm", format);
  }

  if (focalPoint) {
    url.searchParams.set("f", focalPoint);
  }

  if (fit) {
    url.searchParams.set("fit", fit);
  }

  if (radius) {
    url.searchParams.set("r", radius.toString());
  }

  return url.toString();
}
