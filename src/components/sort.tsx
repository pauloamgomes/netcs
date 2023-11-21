"use client";

import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";

import { updateQueryParams } from "~/lib/utils";

import { BarsArrowUp } from "./icons";

export function Sort({
  active,
  className,
}: {
  url?: string;
  active: "ASC" | "DESC";
  className?: string;
}) {
  const currentPath = usePathname();
  const router = useRouter();

  const handleSort = (sort: string) => {
    const queryParams = updateQueryParams({ sort });
    router.push(`${currentPath}?${queryParams}`);
  };

  return (
    <ul
      className={clsx(
        "menu menu-horizontal bg-base-200 rounded-box z-20",
        className
      )}
    >
      <li className="p-0 m-0">
        <details>
          <summary>Sort</summary>
          <ul className="bg-base-200 w-40 flex flex-col gap-y-1 p-2 -right-1">
            <li className={clsx("p-0 m-0", active === "DESC" && "disabled")}>
              <button
                onClick={() => handleSort("DESC")}
                className="p-3 flex items-center m-0"
              >
                <BarsArrowUp className="w-5 h-5 rotate-180" />
                By Newest
              </button>
            </li>
            <li className={clsx("p-0 m-0", active === "ASC" && "disabled")}>
              <button
                onClick={() => handleSort("ASC")}
                className="p-3 flex items-center m-0"
              >
                <BarsArrowUp className="w-5 h-5" />
                By Oldest
              </button>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  );
}
