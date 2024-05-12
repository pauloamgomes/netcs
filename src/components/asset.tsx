"use client";

import 'react-medium-image-zoom/dist/styles.css'

import Image from "next/image";
import Zoom from 'react-medium-image-zoom'

import { Asset } from "~generated/graphql";

import { TextWithLinks } from "./text-with-links";

export function AssetBlock({ asset }: { asset: Asset }) {
  const { url, title = "", description, width = 960, height = 540 } = asset;

  if (!url) {
    return null;
  }

  return (
    <Zoom zoomImg={{ src: url }}>
      <figure className="mb-4 mt-6 w-full">
        <Image
          src={url}
          alt={title || ""}
          title={title || ""}
          width={width || 960}
          height={height || 540}
          loading="lazy"
          className="rounded-lg"
        />
        {description ? (
          <figcaption className="px-1 mt-2 text-xs leading-4">
            <TextWithLinks text={description} />
          </figcaption>
        ) : null}
      </figure>
    </Zoom>
  );
}
