import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import { Maybe } from "~generated/graphql";

import { ChevronRightIcon } from "./icons";

export function Card<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...props
}: Omit<React.ComponentPropsWithoutRef<T>, "as" | "className"> & {
  as?: T;
  className?: string;
}) {
  let Component = as ?? "div";

  return (
    <Component
      className={clsx(
        "group relative flex flex-col bg-base-200 focus-within:ring-2 focus-within:ring-inset hover:opacity-75 transition-opacity duration-150 ease-in-out rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

Card.Title = function CardTitle<T extends React.ElementType = "h2">({
  as,
  href,
  className,
  children,
}: Omit<React.ComponentPropsWithoutRef<T>, "as" | "href"> & {
  as?: T;
  href?: string;
}) {
  let Component = as ?? "h2";

  return (
    <Component
      className={clsx(
        "text-lg font-semibold leading-6 mt-4 h-auto sm:h-12 sm:line-clamp-2 px-4",
        className
      )}
    >
      {href ? <Card.Link href={href}>{children}</Card.Link> : children}
    </Component>
  );
};

Card.SubTitle = function CardSubTitle<T extends React.ElementType = "h2">({
  as,
  className,
  children,
}: Omit<React.ComponentPropsWithoutRef<T>, "as" | "href"> & {
  as?: T;
  href?: string;
}) {
  let Component = as ?? "h2";

  return (
    <Component
      className={clsx("text-sm flex items-center leading-6 px-4", className)}
    >
      {children}
    </Component>
  );
};

Card.Description = function CardDescription({
  children,
  className,
  height = "md",
}: {
  children: React.ReactNode;
  className?: string;
  height?: "sm" | "md" | "lg";
}) {
  return (
    <p
      className={clsx(
        "mt-4 text-sm px-4",
        className,
        height === "sm"
          ? "line-clamp-2"
          : height === "lg"
            ? "line-clamp-6"
            : "line-clamp-4"
      )}
    >
      {children}
    </p>
  );
};

Card.Cta = function CardCta({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "flex flex-row w-full text-center justify-center items-center my-4",
        className
      )}
    >
      <span className="btn btn-ghost btn-sm">
        {children}
        <ChevronRightIcon className="h-4 w-4 stroke-current" />
      </span>
    </div>
  );
};

Card.Image = function CardImage({
  url,
  alt = "",
  width = 300,
  height = 180,
  className,
  imgClassName,
}: {
  url?: string;
  alt?: Maybe<string>;
  width?: number;
  height?: number;
  className?: string;
  imgClassName?: string;
}) {
  if (!url) {
    return null;
  }

  return (
    <figure className={className}>
      <Image
        src={url}
        alt={alt || ""}
        width={width}
        height={height}
        className={clsx("w-full rounded-t-xl", imgClassName)}
      />
    </figure>
  );
};

Card.Link = function CardLink({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <>
      <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 opacity-0 transition sm:-inset-x-6 sm:rounded-2xl" />
      <Link {...props}>
        <span className="absolute -inset-x-4 -inset-y-6 z-0 sm:-inset-x-6 sm:rounded-2xl" />
        <span className="relative z-0">{children}</span>
      </Link>
    </>
  );
};
