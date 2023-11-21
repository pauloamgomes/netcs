import clsx from "clsx";
import Link from "next/link";
import React from "react";

import { previewProps } from "~/lib/preview";
import { Maybe } from "~generated/graphql";

export function SectionHeading({
  id,
  title,
  summary,
  cta,
  icon,
}: {
  id?: string;
  title?: Maybe<string>;
  summary?: Maybe<string>;
  cta?: {
    label?: string;
    url?: string;
  };
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      {title && (
        <h2
          {...previewProps({
            entryId: id,
            fieldId: "title",
          })}
          className="text-3xl font-bold max-w-2xl flex items-center"
        >
          {icon}
          <span className={clsx(icon && "ml-2")}>{title}</span>
        </h2>
      )}
      {summary && (
        <p
          {...previewProps({
            entryId: id,
            fieldId: "summary",
          })}
          className="my-4 max-w-2xl"
        >
          {summary}
        </p>
      )}
      {cta?.url && (
        <p>
          <Link
            {...previewProps({
              entryId: id,
              fieldId: "cta",
            })}
            href={cta.url}
            className="btn btn-outline btn-neutral btn-sm"
          >
            {cta.label}
          </Link>
        </p>
      )}
    </div>
  );
}
