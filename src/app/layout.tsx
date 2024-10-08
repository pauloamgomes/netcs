import "./globals.css";

import clsx from "clsx";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies, draftMode } from "next/headers";
import Script from "next/script";

import { DraftModeMessage } from "~/components/draft-mode-message";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { Notifications } from "~/components/notifications";
import { queryGlobalSiteSettings } from "~/gql/queries";
import { contentfulGqlQuery } from "~/lib/contentful";
import { themes } from "~/lib/themes";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// Ondemand revalidation
export const revalidate = process.env.NODE_ENV === "production" ? false : 0;

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await contentfulGqlQuery(queryGlobalSiteSettings);

  const { siteName, seoTitle, seoDescription, seoImage } =
    siteData?.siteSettingsCollection?.items?.[0] || {};

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
    applicationName: siteName,
    title: {
      template: `%s | ${siteName}`,
      default: `${seoTitle} | ${siteName}`,
    },
    description: seoDescription,
    openGraph: {
      siteName,
      images: seoImage?.url ? [seoImage.url] : [],
    },
    alternates: {
      types: {
        "application/rss+xml": `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
      },
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteData = await contentfulGqlQuery(queryGlobalSiteSettings);
  const site = siteData?.siteSettingsCollection?.items?.[0];

  const themeCookie = cookies().get("theme");
  const currentTheme = themeCookie ? themeCookie.value : themes[0];

  return (
    <html
      lang="en"
      data-theme={currentTheme}
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={clsx(inter.className, "flex flex-col h-full")}>
        <Header site={site} />

        {children}

        <Footer site={site} />

        <Notifications items={site.notificationsCollection?.items} />

        {draftMode().isEnabled && (
          <>
            <DraftModeMessage />
            <Script src="/live-preview.mjs" />
          </>
        )}
      </body>
    </html>
  );
}
