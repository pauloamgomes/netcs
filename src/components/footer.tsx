import Link from "next/link";

import { getPageUrl } from "~/lib/navigation";
import { previewProps } from "~/lib/preview";
import { SiteSettings } from "~generated/graphql";

import { SocialLink } from "./social-links";

export function Footer({ site }: { site: SiteSettings }) {
  const menuItems = site?.mainMenuItemsCollection?.items || [];
  const socialIcons = site?.socialLinksCollection?.items || [];

  return (
    <footer className="mx-auto w-full pt-8 pb-10 bg-base-300">
      <div className="container mx-auto footer p-4 items-center">
        <aside className="flex flex-col gap-y-4">
          <nav
            {...previewProps({
              entryId: site.sys.id,
              fieldId: "mainMenuItems",
            })}
            className="flex flex-col sm:flex-row gap-x-4 md:place-self-center md:justify-self-end"
          >
            {menuItems?.map((item) => (
              <Link
                key={item?.sys.id}
                href={getPageUrl(item?.page) || item?.externalUrl || "#"}
                className="text-xl sm:text-lg p-1"
              >
                {item?.label}
              </Link>
            ))}
          </nav>
          <p className="text-sm px-1">
            ❤️ Build with{" "}
            <Link
              href="https://github.com/pauloamgomes/netcs"
              className="border-b-[0.5px] border-primary"
            >
              Next Easy Tailwind Contentful Starter
            </Link>
          </p>
          <p
            {...previewProps({
              entryId: site.sys.id,
              fieldId: "copyrightLine",
            })}
            className="text-xs px-1"
          >
            &copy; {new Date().getFullYear()} {site.copyrightLine}
          </p>
        </aside>
        <nav
          {...previewProps({
            entryId: site.sys.id,
            fieldId: "socialLinks",
          })}
          className="grid-flow-col gap-1 md:place-self-center md:justify-self-end"
        >
          {socialIcons?.map((icon) => (
            <SocialLink key={icon?.sys.id} link={icon} />
          ))}
        </nav>
      </div>
    </footer>
  );
}
