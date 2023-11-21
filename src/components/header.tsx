import Image from "next/image";
import Link from "next/link";

import { contentfulImgUrl } from "~/lib/image";
import { getNavigationLinkUrl } from "~/lib/navigation";
import { previewProps } from "~/lib/preview";
import { SiteSettings } from "~generated/graphql";

import { MainMenu } from "./main-menu";
import ThemeProvider from "./theme-provider";

export async function Header({ site }: { site: SiteSettings }) {
  const mainMenuItems = site?.mainMenuItemsCollection?.items || [];

  const navLinks =
    mainMenuItems.map((item) => ({
      id: item?.sys.id,
      href: getNavigationLinkUrl(item) || "#",
      label: item?.label || "",
    })) || [];

  return (
    <div className="container mx-auto navbar bg-base-100 mt-4 mb-4 nav-header">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <MainMenu navLinks={navLinks} variant="mobile" />
        </div>
        <Link
          {...previewProps({
            entryId: site.sys.id,
            fieldId: "siteLogo",
          })}
          href="/"
        >
          {site?.siteLogo?.url ? (
            <Image
              src={contentfulImgUrl(site.siteLogo, {
                width: 60,
                height: 60,
                fit: "scale",
              })}
              width={60}
              height={60}
              alt={site.siteLogo.title || ""}
              className="h-16 w-16 mask mask-circle"
              priority
            />
          ) : null}
        </Link>
      </div>
      <div
        {...previewProps({
          entryId: site.sys.id,
          fieldId: "mainMenuItems",
        })}
        className="navbar-center hidden md:flex"
      >
        <MainMenu navLinks={navLinks} variant="desktop" />
      </div>
      <div className="navbar-end">
        <ThemeProvider />
      </div>
    </div>
  );
}
