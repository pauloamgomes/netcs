import clsx from "clsx";
import Link from "next/link";

import { Category, Maybe } from "~generated/graphql";

export function CategoryBadge({
  url,
  category,
  className,
}: {
  url?: string;
  category: Maybe<Category>;
  className?: string;
}) {
  if (!category?.sys.id) {
    return null;
  }

  const classes = clsx(
    "my-2 mr-2 badge badge-lg",
    category?.color === "red"
      ? "bg-red-800 text-white"
      : category?.color === "pink"
        ? "bg-pink-800 text-white"
        : category?.color === "orange"
          ? "bg-orange-800 text-white"
          : category?.color === "yellow"
            ? "bg-yellow-800 text-white"
            : category?.color === "green"
              ? "bg-green-800 text-white"
              : category?.color === "teal"
                ? "bg-teal-800 text-white"
                : category?.color === "blue"
                  ? "bg-blue-800 text-white"
                  : category?.color === "indigo"
                    ? "bg-indigo-800 text-white"
                    : category?.color === "purple"
                      ? "bg-purple-800 text-white"
                      : category?.color === "light-blue"
                        ? "bg-blue-600 text-white"
                        : category?.color === "light-green"
                          ? "bg-green-700 text-white"
                          : category?.color === "lime"
                            ? "bg-lime-700 text-white"
                            : category?.color === "amber"
                              ? "bg-amber-700 text-white"
                              : category?.color === "deep-orange"
                                ? "bg-orange-900 text-white"
                                : category?.color === "rose"
                                  ? "bg-rose-700 text-white"
                                  : category?.color === "sky"
                                    ? "bg-sky-700 text-white"
                                    : category?.color === "cyan"
                                      ? "bg-cyan-700 text-white"
                                      : category?.color === "violet"
                                        ? "bg-violet-700 text-white"
                                        : "bg-gray-700 text-white",
    className
  );

  return url ? (
    <Link href={url} className={classes}>
      {category?.title}
    </Link>
  ) : (
    <span className={classes}>{category?.title}</span>
  );
}
