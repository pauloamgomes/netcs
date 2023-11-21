import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import { contentfulImgUrl } from "~/lib/image";
import { getNavigationLinkUrl } from "~/lib/navigation";
import { previewProps } from "~/lib/preview";
import { PageHero as IPageHero } from "~generated/graphql";

import { SocialIcons } from "./social-icons";

export function WithBackgroundImageHero({
  sys,
  title,
  eyebrow,
  description,
  image,
  cta,
  socialLinksCollection,
  minHeight = "100%",
  className,
}: { className?: string } & IPageHero) {
  return (
    <div className={clsx("hero overflow-hidden", className)}>
      <div className="hero-overlay bg-gradient-to-b from-base-100 to-transparent bg-opacity-10"></div>
      <div
        className="relative inset-0 w-screen"
        style={{
          minHeight: minHeight?.toLowerCase()?.replace("%", "vh") || "100vh",
        }}
      >
        {image?.url && (
          <Image
            src={contentfulImgUrl(image, {
              width: 1280,
              aspectRatio: "16:9",
            })}
            className="object-cover object-center -z-10"
            alt={image.title || ""}
            fill
            priority
            quality={60}
            sizes={"100vw"}
          />
        )}
      </div>
      <div className="hero-content text-center hero-heading">
        <div className="w-full lg:max-w-4xl">
          {eyebrow && (
            <p
              {...previewProps({
                entryId: sys.id,
                fieldId: "eyebrow",
              })}
              className="ml-1 font-semibold leading-7"
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
              className="mb-5 text-4xl lg:text-7xl font-bold whitespace-normal lg:whitespace-pre-wrap"
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
              className="mb-5 text-2xl whitespace-pre-wrap font-semibold"
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
              className="hero-bg-btn-cta btn btn-outline mt-4"
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
            className="justify-center items-center mt-8"
          />
        </div>
      </div>
    </div>
  );
}
