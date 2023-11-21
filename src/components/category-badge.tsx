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
      ? "bg-red-700 text-white"
      : category?.color === "pink"
      ? "bg-pink-700 text-white"
      : category?.color === "orange"
      ? "bg-orange-700 text-white"
      : category?.color === "yellow"
      ? "bg-yellow-600 text-white"
      : category?.color === "green"
      ? "bg-green-700 text-white"
      : category?.color === "teal"
      ? "bg-teal-700 text-white"
      : category?.color === "blue"
      ? "bg-blue-700 text-white"
      : category?.color === "indigo"
      ? "bg-indigo-700 text-white"
      : category?.color === "purple"
      ? "bg-purple-700 text-white"
      : category?.color === "light-blue"
      ? "bg-blue-500 text-white"
      : category?.color === "light-green"
      ? "bg-green-600 text-white"
      : category?.color === "lime"
      ? "bg-lime-600 text-white"
      : category?.color === "amber"
      ? "bg-amber-600 text-white"
      : category?.color === "deep-orange"
      ? "bg-orange-900 text-white"
      : category?.color === "rose"
      ? "bg-rose-600 text-white"
      : category?.color === "sky"
      ? "bg-sky-600 text-white"
      : category?.color === "cyan"
      ? "bg-cyan-600 text-white"
      : category?.color === "violet"
      ? "bg-violet-600 text-white"
      : "bg-gray-600 text-white",
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
