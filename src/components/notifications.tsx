"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import { RichText } from "~/lib/rich-text";
import { InfoMessage } from "~generated/graphql";

export function Notifications({ items }: { items?: InfoMessage[] }) {
  const [loaded, setLoaded] = useState(false);
  const [value, setValue] = useLocalStorage("notifications", [] as string[]);

  useEffect(() => {
    let timer = window.setTimeout(() => setLoaded(true), 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!items?.length || !loaded) {
    return null;
  }

  return (
    <div className="toast toast-end z-10 text-xs">
      {items
        .filter(
          (item) => !value.includes(`${item?.sys.id}_${item?.sys.publishedAt}`)
        )
        .map((item) => (
          <div
            key={`${item?.sys.id}_${item?.sys.publishedAt}`}
            className={clsx(
              "alert whitespace-pre-wrap max-w-xs p-3",
              item.status === "Info" && "alert-info",
              item.status === "Warning" && "alert-warning",
              item.status === "Error" && "alert-error",
              item.status === "Success" && "alert-success"
            )}
          >
            <div className="flex gap-2 justify-between items-center [&_a]:underline">
              <button
                className="btn btn-ghost btn-xs btn-circle"
                aria-label="Close"
                onClick={() =>
                  setValue([
                    ...value,
                    `${item?.sys.id}_${item?.sys.publishedAt}`,
                  ])
                }
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-4 h-4 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
              <RichText document={item.message} />
            </div>
          </div>
        ))}
    </div>
  );
}
