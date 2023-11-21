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
        siteName
        homepage {
          __typename
          slug
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

  query queryPage($slug: String, $preview: Boolean = false) {
    pageCollection(where: { slug: $slug }, limit: 1, preview: $preview) {
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
