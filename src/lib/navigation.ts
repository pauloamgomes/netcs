import {
  BlogArticle,
  Maybe,
  NavigationLink,
  Page,
  Project,
  WorkExperience,
} from "~generated/graphql";

export function getEntrySlug(
  page: NavigationLink["page"] | Page | BlogArticle | Project | WorkExperience
) {
  if (!page) {
    return null;
  }

  if (page.__typename === "Page") {
    return `${page.slug === "homepage" ? "" : page.slug}`;
  } else if (page.__typename === "BlogArticle") {
    return `articles/${page.slug}`;
  } else if (page.__typename === "Project") {
    return `projects/${page.slug}`;
  } else if (page.__typename === "Category") {
    return `category/${page.slug}`;
  } else if (page.__typename === "WorkExperience") {
    return `work/${page.slug}`;
  }

  return null;
}

export function getPageUrl(page: NavigationLink["page"]) {
  const slug = getEntrySlug(page);

  if (!slug) {
    return;
  }

  return `/${slug}`.replace(/\/+/g, "/");
}

export function getNavigationLinkUrl(link: Maybe<NavigationLink>) {
  if (!link?.label) {
    return "#";
  }

  if (link?.externalUrl) {
    return link.externalUrl;
  } else if (link?.page?.__typename) {
    return getPageUrl(link.page);
  }

  return "#";
}
