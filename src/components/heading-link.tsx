"use client";

import { useState } from "react";

import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from "./icons";

export function HeadingLink({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied">("idle");

  const handleCopyLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.href + `#${slug}`);
    setStatus("copied");
    window.setTimeout(() => {
      setStatus("idle");
    }, 3000);
  };

  return (
    <a href={`#${slug}`} className="no-underline" onClick={handleCopyLink}>
      <h2 id={slug} className="flex items-center gap-x-2 group">
        {children}
        {status === "copied" ? (
          <button className="btn btn-xs flex items-center gap-x-1">
            <ClipboardDocumentCheckIcon className="w-4 h-4" />
            Copied
          </button>
        ) : (
          <button className="btn btn-xs flex items-center gap-x-1 invisible group-hover:visible">
            <ClipboardDocumentIcon className="w-4 h-4" />
            Copy link
          </button>
        )}
      </h2>
    </a>
  );
}
