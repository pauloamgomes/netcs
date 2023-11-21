"use client";

import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";

import { updateQueryParams } from "~/lib/utils";

export function Pagination({
  currPage,
  totalPages,
}: {
  currPage: number;
  totalPages: number;
}) {
  const path = usePathname();
  const router = useRouter();

  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const prevPage = currPage - 1 || 1;
  const nextPage = currPage + 1 > totalPages ? totalPages : currPage + 1;

  const handleNavigation = (page: number) => {
    const queryParams = updateQueryParams({ page: `${page}` });
    router.push(`${path}?${queryParams}`);
  };

  return (
    <div className="join grid grid-cols-3 items-center">
      <button
        onClick={() => handleNavigation(prevPage)}
        className={clsx("join-item btn", currPage <= 1 && "btn-disabled")}
      >
        «
      </button>

      <span className="join-item btn">
        Page {currPage} / {totalPages}
      </span>

      <button
        onClick={() => handleNavigation(nextPage)}
        className={clsx(
          "join-item btn",
          currPage >= totalPages && "btn-disabled"
        )}
      >
        »
      </button>
    </div>
  );
}
