import { gql } from "graphql-request";

import {
  FragmentAccordion,
  FragmentAsset,
  FragmentBlocksFeaturedProjects,
  FragmentBlocksNewsletterSignup,
  FragmentBlocksRecentArticles,
  FragmentBlocksSkills,
  FragmentBlocksText,
  FragmentBlocksWorkResume,
  FragmentCategory,
  FragmentCodeSnippet,
  FragmentInfoMessage,
  FragmentMedia,
  FragmentNavigationLink,
  FragmentPageHero,
  FragmentProject,
  FragmentText,
} from "~/gql/fragments";

export const querySiteSettings = gql`
  query querySiteSettings($preview: Boolean = false) {
    siteSettingsCollection(limit: 1, preview: $preview) {
      items {
        sys {
          id
        }
        siteName
        homepage {
          __typename
          slug
        }
      }
    }
  }
`;

export const queryGlobalSiteSettings = gql`
  ${FragmentNavigationLink}
  ${FragmentAsset}
  ${FragmentInfoMessage}

  query queryGlobalSiteSettings($preview: Boolean = false) {
    siteSettingsCollection(limit: 1, preview: $preview) {
      items {
        sys {
          id
        }
        siteName
        siteLogo {
          ...FragmentAsset
        }
        copyrightLine
        homepage {
          __typename
          slug
        }
        seoTitle
        seoDescription
        seoImage {
          ...FragmentAsset
        }
        mainMenuItemsCollection(limit: 6) {
          items {
            ...FragmentNavigationLink
          }
        }
        socialLinksCollection(limit: 6) {
          items {
            ...FragmentNavigationLink
          }
        }
        notificationsCollection(limit: 3) {
          items {
            sys {
              id
              publishedAt
            }
            ...FragmentInfoMessage
          }
        }
      }
    }
  }
`;

export const queryBlogArticle = gql`
  ${FragmentNavigationLink}
  ${FragmentAsset}
  ${FragmentCodeSnippet}
  ${FragmentMedia}
  ${FragmentInfoMessage}
  ${FragmentText}
  ${FragmentAccordion}

  query queryBlogArticle($slug: String, $preview: Boolean = false) {
    blogArticleCollection(where: { slug: $slug }, limit: 1, preview: $preview) {
      items {
        sys {
          id
        }
        title
        slug
        publishedDate
        seoTitle
        seoDescription
        seoImage {
          ...FragmentAsset
        }
        featuredImage {
          ...FragmentAsset
        }
        categoriesCollection(limit: 10) {
          items {
            ... on Category {
              __typename
              sys {
                id
              }
              slug
              title
              color
            }
          }
        }
        referencesAndResourcesCollection(limit: 10) {
          items {
            ...FragmentNavigationLink
          }
        }
        summary
        readingTime
        body {
          json
          links {
            __typename
            entries {
              block {
                __typename
                ... on CodeSnippet {
                  ...FragmentCodeSnippet
                }
                ... on Media {
                  ...FragmentMedia
                }
                ... on InfoMessage {
                  ...FragmentInfoMessage
                }
                ... on Accordion {
                  ...FragmentAccordion
                }
              }
            }
            assets {
              block {
                ...FragmentAsset
              }
            }
          }
        }
      }
    }
  }
`;

export const queryProject = gql`
  ${FragmentAsset}
  ${FragmentText}
  ${FragmentCodeSnippet}
  ${FragmentMedia}
  ${FragmentInfoMessage}
  ${FragmentAccordion}

  query queryProject($slug: String, $preview: Boolean = false) {
    projectCollection(where: { slug: $slug }, limit: 1, preview: $preview) {
      items {
        sys {
          id
        }
        title
        slug
        status
        url
        featuredImage {
          ...FragmentAsset
        }
        publishedDate
        seoTitle
        seoDescription
        seoImage {
          ...FragmentAsset
        }
        summary
        body {
          json
          links {
            __typename
            entries {
              block {
                __typename
                ... on CodeSnippet {
                  ...FragmentCodeSnippet
                }
                ... on Media {
                  ...FragmentMedia
                }
                ... on InfoMessage {
                  ...FragmentInfoMessage
                }
                ... on Accordion {
                  ...FragmentAccordion
                }
              }
            }
            assets {
              block {
                ...FragmentAsset
              }
            }
          }
        }
      }
    }
  }
`;

export const queryWorkExperience = gql`
  ${FragmentAsset}
  ${FragmentCodeSnippet}
  ${FragmentMedia}
  ${FragmentInfoMessage}
  ${FragmentAccordion}
  ${FragmentText}

  query queryWorkExperience($slug: String, $preview: Boolean = false) {
    workExperienceCollection(
      where: { slug: $slug }
      limit: 1
      preview: $preview
    ) {
      items {
        sys {
          id
        }
        companyName
        role
        logo {
          ...FragmentAsset
        }
        startDate
        endDate
        currentWork
        seoTitle
        seoDescription
        seoImage {
          ...FragmentAsset
        }
        summary
        skillsCollection(limit: 8) {
          items {
            ... on Skills {
              sys {
                id
              }
              name
              rating
            }
          }
        }
        body {
          json
          links {
            __typename
            entries {
              block {
                __typename
                ... on CodeSnippet {
                  ...FragmentCodeSnippet
                }
                ... on Media {
                  ...FragmentMedia
                }
                ... on InfoMessage {
                  ...FragmentInfoMessage
                }
                ... on Accordion {
                  ...FragmentAccordion
                }
              }
            }
            assets {
              block {
                ...FragmentAsset
              }
            }
          }
        }
      }
    }
  }
`;

export const queryPage = gql`
  ${FragmentAsset}
  ${FragmentNavigationLink}
  ${FragmentPageHero}
  ${FragmentBlocksRecentArticles}
  ${FragmentProject}
  ${FragmentBlocksFeaturedProjects}
  ${FragmentBlocksWorkResume}
  ${FragmentBlocksNewsletterSignup}
  ${FragmentBlocksText}
  ${FragmentBlocksSkills}

  query queryPage(
    $slug: String
    $preview: Boolean = false
    $template: String = "Page"
  ) {
    pageCollection(
      where: { slug: $slug, template: $template }
      limit: 1
      preview: $preview
    ) {
      items {
        __typename
        sys {
          id
        }
        title
        slug
        template
        hero {
          ...FragmentPageHero
        }
        seoTitle
        seoDescription
        seoImage {
          ...FragmentAsset
        }
        bodyCollection(limit: 10) {
          items {
            __typename
            ... on BlocksRecentArticles {
              ...FragmentBlocksRecentArticles
            }
            ... on BlocksFeaturedProjects {
              ...FragmentBlocksFeaturedProjects
            }
            ... on BlocksWorkResume {
              ...FragmentBlocksWorkResume
            }
            ... on BlocksNewsletterSignup {
              ...FragmentBlocksNewsletterSignup
            }
            ... on BlocksText {
              ...FragmentBlocksText
            }
            ... on BlocksSkills {
              ...FragmentBlocksSkills
            }
          }
        }
      }
    }
  }
`;

export const queryHomePage = gql`
  ${FragmentAsset}
  ${FragmentNavigationLink}
  ${FragmentPageHero}
  ${FragmentBlocksRecentArticles}
  ${FragmentProject}
  ${FragmentBlocksFeaturedProjects}
  ${FragmentBlocksWorkResume}
  ${FragmentBlocksNewsletterSignup}
  ${FragmentBlocksText}
  ${FragmentBlocksSkills}

  query queryHomepage($slug: String = "homepage", $preview: Boolean = false) {
    pageCollection(where: { slug: $slug }, limit: 1, preview: $preview) {
      items {
        sys {
          id
        }
        title
        hero {
          ...FragmentPageHero
        }
        seoTitle
        seoDescription
        seoImage {
          ...FragmentAsset
        }
        bodyCollection(limit: 10) {
          items {
            __typename
            ... on BlocksRecentArticles {
              ...FragmentBlocksRecentArticles
            }
            ... on BlocksFeaturedProjects {
              ...FragmentBlocksFeaturedProjects
            }
            ... on BlocksWorkResume {
              ...FragmentBlocksWorkResume
            }
            ... on BlocksNewsletterSignup {
              ...FragmentBlocksNewsletterSignup
            }
            ... on BlocksText {
              ...FragmentBlocksText
            }
            ... on BlocksSkills {
              ...FragmentBlocksSkills
            }
          }
        }
      }
    }
  }
`;

export const queryArticles = gql`
  ${FragmentAsset}
  ${FragmentCategory}

  query queryArticles(
    $limit: Int = 10
    $skip: Int = 0
    $order: [BlogArticleOrder] = publishedDate_DESC
    $topic: String = null
    $search: String = null
    $preview: Boolean = false
  ) {
    categoryCollection(preview: $preview) {
      items {
        sys {
          id
        }
        slug
        title
        color
      }
    }
    blogArticleCollection(
      limit: $limit
      skip: $skip
      order: $order
      preview: $preview
      where: {
        AND: [
          { categories: { slug: $topic } }
          {
            OR: [
              { title_contains: $search }
              { summary_contains: $search }
              { seoTitle_contains: $search }
              { seoDescription_contains: $search }
            ]
          }
        ]
      }
    ) {
      total
      items {
        __typename
        sys {
          id
        }
        title
        slug
        publishedDate
        summary
        featuredImage {
          ...FragmentAsset
        }
        categoriesCollection(limit: 3) {
          items {
            ...FragmentCategory
          }
        }
      }
    }
  }
`;

export const queryAllArticles = gql`
  query queryAllArticles($limit: Int = 1000, $preview: Boolean = false) {
    blogArticleCollection(
      limit: $limit
      order: publishedDate_DESC
      preview: $preview
    ) {
      items {
        __typename
        sys {
          id
        }
        slug
      }
    }
  }
`;

export const queryProjects = gql`
  ${FragmentAsset}

  query queryProjects($limit: Int = 100, $preview: Boolean = false) {
    projectCollection(
      limit: $limit
      order: publishedDate_DESC
      preview: $preview
    ) {
      items {
        __typename
        sys {
          id
        }
        publishedDate
        title
        slug
        summary
        featuredImage {
          ...FragmentAsset
        }
      }
    }
  }
`;

export const queryWorks = gql`
  ${FragmentAsset}

  query queryWorks($limit: Int = 100, $preview: Boolean = false) {
    workExperienceCollection(
      limit: $limit
      order: endDate_DESC
      preview: $preview
    ) {
      items {
        __typename
        sys {
          id
        }
        companyName
        role
        slug
        summary
        logo {
          ...FragmentAsset
        }
        startDate
        endDate
        currentWork
        body {
          json
        }
        skillsCollection(limit: 10) {
          items {
            sys {
              id
            }
            name
          }
        }
      }
    }
  }
`;

export const queryAllPages = gql`
  query queryAllPages(
    $slug: String
    $preview: Boolean = false
    $template: String = "Page"
  ) {
    pageCollection(
      where: { slug: $slug, template: $template }
      preview: $preview
    ) {
      items {
        __typename
        sys {
          id
        }
        slug
      }
    }
  }
`;
