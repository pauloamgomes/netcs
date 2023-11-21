import clsx from "clsx";
import Link from "next/link";

import { getNavigationLinkUrl } from "~/lib/navigation";
import { previewProps } from "~/lib/preview";
import { PageHero as IPageHero } from "~generated/graphql";

import { SocialIcons } from "./social-icons";

export function WithoutImageHero({
  sys,
  title,
  eyebrow,
  description,
  socialLinksCollection,
  minHeight = "25%",
  variantColor = "Light",
  cta,
  className,
}: { className?: string } & IPageHero) {
  return (
    <div
      className={clsx(
        "hero w-full overflow-hidden py-8",
        variantColor === "Dark" && "bg-base-300",
        variantColor === "Light" && "bg-base-100",
        variantColor === "Primary" && "bg-primary [&_*]:text-white",
        variantColor === "Secondary" && "bg-secondary [&_*]:text-white",
        variantColor === "Accent" && "bg-accent",
        variantColor === "Info" && "bg-info",
        className
      )}
      style={{
        minHeight: minHeight?.toLowerCase()?.replace("%", "vh") || "25vh",
      }}
    >
      <div className="hero-content w-screen text-center">
        <div className="max-w-3xl">
          {eyebrow && (
            <p
              {...previewProps({
                entryId: sys.id,
                fieldId: "eyebrow",
              })}
              className="ml-1 text-base font-semibold leading-7"
            >
              {eyebrow}
            </p>
          )}
          {title && (
            <h1
              {...previewProps({
                entryId: sys.id,
                fieldId: "title",
              })}
              className="text-5xl font-bold md:whitespace-pre-wrap"
            >
              {title}
            </h1>
          )}
          {description && (
            <p
              {...previewProps({
                entryId: sys.id,
                fieldId: "description",
              })}
              className="py-6 text-xl md:whitespace-pre-wrap"
            >
              {description}
            </p>
          )}

          {cta && (
            <Link
              {...previewProps({
                entryId: sys.id,
                fieldId: "cta",
              })}
              className={clsx(
                "btn btn-outline mt-4",
                variantColor === "Primary" &&
                  "text-white border-white hover:bg-white/10 hover:border-white",
                variantColor === "Secondary" &&
                  "text-white border-white hover:bg-white/10 hover:border-white"
              )}
              href={getNavigationLinkUrl(cta) || "#"}
            >
              {cta.label}
            </Link>
          )}

          <SocialIcons
            {...previewProps({
              entryId: sys.id,
              fieldId: "socialLinks",
            })}
            socialLinks={socialLinksCollection?.items}
            className="justify-center mt-4"
          />
        </div>
      </div>
    </div>
  );
}
