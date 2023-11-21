"use client";

import dynamic from "next/dynamic";

import { Media } from "~generated/graphql";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

export function MediaBlock({
  sys,
  title,
  videoUrl,
  videoAsset,
  caption,
}: Media) {
  if (!videoUrl && !videoAsset) {
    return null;
  }

  return (
    <div className="my-4 max-w-3xl">
      {title ? <h3 className="text-lg font-bold mb-2">{title}</h3> : null}
      <div className="h-auto max-w-3xl relative pt-[56.25%]">
        {videoUrl ? (
          <ReactPlayer
            className="absolute top-0 left-0"
            url={videoUrl}
            width="100%"
            height="100%"
          />
        ) : videoAsset?.url ? (
          <ReactPlayer
            className="absolute top-0 left-0"
            url={videoAsset.url}
            controls
            width="100%"
            height="95%"
          />
        ) : null}
      </div>
      {caption ? (
        <p className="mx-auto flex justify-center text-center text-sm leading-6">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
