"use client";

import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

import { updateQueryParams } from "~/lib/utils";

export function SearchInput({
  defaultSearch = "",
  className,
}: {
  defaultSearch?: string;
  className?: string;
}) {
  const [search, setSearch] = useState(defaultSearch);
  const [loaded, setLoaded] = useState(false);
  const path = usePathname();
  const router = useRouter();

  const debouncedValue = useDebounce(search, 500);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const queryParams = updateQueryParams(
      {
        search: debouncedValue,
        page: "1",
      },
      true
    );
    router.push(`${path}?${queryParams}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className={clsx("flex items-center w-full", className)}>
      {debouncedValue && (
        <button
          className="btn btn-xs btn-ghost btn-circle mr-1"
          onClick={() => setSearch("")}
        >
          x
        </button>
      )}
      <input
        onChange={(e) => setSearch(e.target.value)}
        name="search"
        type="text"
        defaultValue={search}
        placeholder="Type here to search..."
        className="input input-bordered w-full"
      />
    </div>
  );
}
