import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import { contentfulImgUrl } from "~/lib/image";
import { getNavigationLinkUrl } from "~/lib/navigation";
import { previewProps } from "~/lib/preview";
import { PageHero as IPageHero } from "~generated/graphql";

import { SocialIcons } from "./social-icons";

export async function WithSideImageHero({
  sys,
  title,
  eyebrow,
  description,
  image,
  imageLeft = false,
  imageMask,
  socialLinksCollection,
  minHeight = "40%",
  variantColor = "Light",
  cta,
  className,
}: IPageHero & { imageLeft?: boolean; className?: string }) {
  return (
    <div
      className={clsx(
        "hero w-full py-8",
        variantColor === "Dark" && "bg-base-300",
        variantColor === "Light" && "bg-base-100",
        variantColor === "Primary" && "bg-primary [&_*]:text-white",
        variantColor === "Secondary" && "bg-secondary [&_*]:text-white",
        variantColor === "Accent" && "bg-accent [&_*]:text-white",
        variantColor === "Info" && "bg-info",
        className
      )}
      style={{
        minHeight: minHeight?.toLowerCase()?.replace("%", "vh") || "40vh",
      }}
    >
      <div
        className={clsx(
          "hero-content flex-col w-full",
          imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
        )}
      >
        {image?.url ? (
          <figure
            {...await previewProps({
              entryId: sys.id,
              fieldId: "image",
            })}
            className="relative w-full md:w-1/3"
            style={{
              minHeight:
                minHeight?.toLowerCase()?.replace("%", "vh") || "100vh",
            }}
          >
            <Image
              src={contentfulImgUrl(image, {
                width: 720,
                height: 720,
                fit: "fill",
              })}
              fill
              alt={image?.title || ""}
              sizes="100%"
              className={clsx(
                `rounded-lg shadow-2xl object-cover object-center`,
                imageMask === "decagon" && "mask mask-decagon",
                imageMask === "squircle" && "mask mask-squircle",
                imageMask === "heart" && "mask mask-heart",
                imageMask === "hexagon" && "mask mask-hexagon",
                imageMask === "hexagon-2" && "mask mask-hexagon-2",
                imageMask === "pentagon" && "mask mask-pentagon",
                imageMask === "diamond" && "mask mask-diamond",
                imageMask === "circle" && "mask mask-circle",
                imageMask === "parallelogram" && "mask mask-parallelogram",
                imageMask === "parallelogram-2" && "mask mask-parallelogram-2",
                imageMask === "star" && "mask mask-star",
                imageMask === "star-2" && "mask mask-star-2",
                imageMask === "triangle" && "mask mask-triangle"
              )}
              priority
              quality={60}
            />
          </figure>
        ) : null}
        <div
          className={clsx(
            "w-full sm:max-w-lg lg:max-w-xl lg:w-1/2",
            imageLeft ? "ml-4" : "mr-4"
          )}
        >
          <div>
            {eyebrow && (
              <p
                className="ml-1 text-base font-semibold leading-7 text-center md:text-start"
                {...previewProps({
                  entryId: sys.id,
                  fieldId: "eyebrow",
                })}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h1
                className="text-2xl md:text-4xl lg:text-5xl text-center md:text-start font-bold lg:whitespace-pre-wrap"
                {...previewProps({
                  entryId: sys.id,
                  fieldId: "title",
                })}
              >
                {title}
              </h1>
            )}
            {description && (
              <p
                className="py-6 text-lg"
                {...previewProps({
                  entryId: sys.id,
                  fieldId: "description",
                })}
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
                  "text-white border-white hover:bg-white/10 hover:border-white",
                  variantColor === "Accent" &&
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
              className="text-center md:text-start mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
