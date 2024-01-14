import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import {
  queryBlogArticle,
  queryPage,
  queryProject,
  queryWorkExperience,
} from "~/gql/queries";
import { contentfulGqlQuery } from "~/lib/contentful";
import {
  ArticlesTemplate,
  ArticleTemplate,
  PageTemplate,
  ProjectsTemplate,
  ProjectTemplate,
  WorksTemplate,
  WorkTemplate,
} from "~/templates";
import { BlogArticle, Page, Project, WorkExperience } from "~generated/graphql";

export const revalidate = parseInt(process.env.NEXT_REVALIDATE_SECONDS || "3600", 10); // 60 minutes
export const fetchCache = process.env.NODE_ENV === 'production' ? 'force-cache' : 'force-no-store';

type PageProps = {
  params: { slug: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params: { slug } }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const images = [];

  let title = "";
  let description = "";

  let page: Page | BlogArticle | WorkExperience | Project | undefined | null =
    null;
  if (slug.length > 1 && slug[0] === "articles") {
    const data = await contentfulGqlQuery(queryBlogArticle, {
      slug: slug.slice(1).join("/"),
    });
    page = data?.blogArticleCollection.items[0] as BlogArticle;
    if (page?.featuredImage?.url) {
      images.push(page.featuredImage.url);
    }
    title = page?.title || "";
    description = page?.summary || "";
  } else if (slug.length > 1 && slug[0] === "projects") {
    const data = await contentfulGqlQuery(queryProject, {
      slug: slug.slice(1).join("/"),
    });
    page = data?.projectCollection.items[0] as Project;
    if (page?.featuredImage?.url) {
      images.push(page.featuredImage.url);
    }
    title = page?.title || "";
    description = page?.summary || "";
  } else if (slug.length > 1 && slug[0] === "work") {
    const data = await contentfulGqlQuery(queryWorkExperience, {
      slug: slug.slice(1).join("/"),
    });
    page = data?.workExperienceCollection.items[0] as WorkExperience;
    title = `${page.role} - ${page.companyName}`;
    description = page?.summary || "";
  } else {
    const data = await contentfulGqlQuery(queryPage, {
      slug: slug.join("/"),
    });
    page = data?.pageCollection.items[0] as Page;
    title = page?.hero?.title || "";
    description = page?.hero?.description?.slice(0, 160) || "";
  }

  if (!page?.sys.id) {
    return {};
  }

  // Use the page's SEO settings if they exist, otherwise use the defaults
  const { seoTitle, seoDescription, seoImage } = page;

  if (seoImage?.url) {
    images.unshift(seoImage.url);
  }

  const previousImages: any = (await parent).openGraph?.images || [];

  return {
    title: seoTitle || title,
    description: seoDescription || description,
    openGraph: {
      images: [...images, ...previousImages],
    },
  };
}

export default async function BasicPage({
  params: { slug },
  searchParams,
}: PageProps) {
  // Children pages for articles, projects and work experience

  if (slug.length > 1 && slug[0] === "articles") {
    const data = await contentfulGqlQuery(queryBlogArticle, {
      slug: slug.slice(1).join("/"),
    });

    return (
      <ArticleTemplate article={data?.blogArticleCollection?.items?.[0]} />
    );
  } else if (slug.length > 1 && slug[0] === "projects") {
    const data = await contentfulGqlQuery(queryProject, {
      slug: slug.slice(1).join("/"),
    });

    return <ProjectTemplate project={data?.projectCollection?.items?.[0]} />;
  } else if (slug.length > 1 && slug[0] === "work") {
    const data = await contentfulGqlQuery(queryWorkExperience, {
      slug: slug.slice(1).join("/"),
    });

    return <WorkTemplate work={data?.workExperienceCollection?.items?.[0]} />;
  }

  // Main pages

  const data = await contentfulGqlQuery(queryPage, {
    slug: slug.join("/"),
  });

  if (!data?.pageCollection?.items?.[0]?.sys?.id) {
    return notFound();
  }

  const page = data.pageCollection.items[0];

  if (page.template === "Articles") {
    return <ArticlesTemplate page={page} searchParams={searchParams} />;
  } else if (page.template === "Projects") {
    return <ProjectsTemplate page={page} />;
  } else if (page.template === "Work Experience") {
    return <WorksTemplate page={page} />;
  } else if (page.template === "Page") {
    return <PageTemplate page={page} />;
  }

  return notFound();
}
