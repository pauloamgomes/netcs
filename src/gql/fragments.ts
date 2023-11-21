import { gql } from "graphql-request";

export const FragmentNavigationLink = gql`
  fragment FragmentNavigationLink on NavigationLink {
    sys {
      id
    }
    __typename
    label
    page {
      __typename
      ... on Page {
        sys {
          id
        }
        slug
      }
      ... on BlogArticle {
        sys {
          id
        }
        slug
      }
      ... on Project {
        sys {
          id
        }
        slug
      }
      ... on WorkExperience {
        sys {
          id
        }
        slug
      }
    }
    externalUrl
    icon
  }
`;

export const FragmentAsset = gql`
  fragment FragmentAsset on Asset {
    __typename
    sys {
      id
    }
    title
    description
    url
    width
    height
    contentType
    fileName
  }
`;

export const FragmentBlocksWorkResume = gql`
  fragment FragmentBlocksWorkResume on BlocksWorkResume {
    sys {
      id
    }
    title
    summary
    viewAllPage {
      __typename
      slug
    }
    worksCollection(limit: 6) {
      items {
        sys {
          id
        }
        companyName
        summary
        role
        logo {
          url
        }
        startDate
        endDate
        currentWork
        skillsCollection(limit: 5) {
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

export const FragmentBlocksSkills = gql`
  fragment FragmentBlocksSkills on BlocksSkills {
    sys {
      id
    }
    title
    summary
    showOnlySkills
    hideRatings
    skillsCollection(limit: 20) {
      items {
        sys {
          id
        }
        name
        rating
        externalUrl
        summary
      }
    }
  }
`;

export const FragmentBlocksNewsletterSignup = gql`
  fragment FragmentBlocksNewsletterSignup on BlocksNewsletterSignup {
    sys {
      id
    }
    title
    description
    thankYouMessage
    errorMessage
  }
`;

export const FragmentPageHero = gql`
  fragment FragmentPageHero on PageHero {
    sys {
      id
    }
    title
    eyebrow
    description
    variant
    variantColor
    image {
      ...FragmentAsset
    }
    imageMask
    minHeight
    cta {
      ...FragmentNavigationLink
    }
    socialLinksCollection(limit: 6) {
      items {
        ...FragmentNavigationLink
      }
    }
  }
`;

export const FragmentBlocksRecentArticles = gql`
  fragment FragmentBlocksRecentArticles on BlocksRecentArticles {
    sys {
      id
    }
    title
    summary
    maxArticlesToDisplay
    viewAllPage {
      __typename
      slug
    }
  }
`;

export const FragmentProject = gql`
  fragment FragmentProject on Project {
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
  }
`;

export const FragmentBlocksFeaturedProjects = gql`
  fragment FragmentBlocksFeaturedProjects on BlocksFeaturedProjects {
    sys {
      id
    }
    title
    summary
    projectsCollection(limit: 9) {
      items {
        ...FragmentProject
      }
    }
    variant
    projectImageMask
    viewAllPage {
      __typename
      slug
    }
  }
`;

export const FragmentCodeSnippet = gql`
  fragment FragmentCodeSnippet on CodeSnippet {
    sys {
      id
    }
    title
    snippet
    caption
  }
`;

export const FragmentMedia = gql`
  fragment FragmentMedia on Media {
    sys {
      id
    }
    title
    caption
    videoUrl
    videoAsset {
      url
    }
  }
`;

export const FragmentBlocksText = gql`
  fragment FragmentBlocksText on BlocksText {
    sys {
      id
    }
    backgroundColor
  }
`;

export const FragmentInfoMessage = gql`
  fragment FragmentInfoMessage on InfoMessage {
    sys {
      id
    }
    status
    message {
      json
      links {
        entries {
          hyperlink {
            __typename
            ... on Page {
              sys {
                id
              }
              slug
            }
            ... on BlogArticle {
              sys {
                id
              }
              slug
            }
            ... on Project {
              sys {
                id
              }
              slug
            }
            ... on WorkExperience {
              sys {
                id
              }
              slug
            }
          }
        }
      }
    }
  }
`;

export const FragmentCategory = gql`
  fragment FragmentCategory on Category {
    sys {
      id
    }
    title
    slug
    color
  }
`;

export const FragmentText = gql`
  fragment FragmentText on Text {
    __typename
    sys {
      id
    }
    title
    text {
      json
      links {
        assets {
          block {
            ...FragmentAsset
          }
        }
        entries {
          hyperlink {
            __typename
            ... on Page {
              sys {
                id
              }
              slug
            }
            ... on BlogArticle {
              sys {
                id
              }
              slug
            }
            ... on Project {
              sys {
                id
              }
              slug
            }
            ... on WorkExperience {
              sys {
                id
              }
              slug
            }
          }
        }
      }
    }
  }
`;

export const FragmentAccordion = gql`
  fragment FragmentAccordion on Accordion {
    sys {
      id
    }
    itemsCollection(limit: 8) {
      items {
        __typename
        ... on Text {
          ...FragmentText
        }
      }
    }
  }
`;
