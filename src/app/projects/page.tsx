import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import BlocksRenderer from "~/components/blocks-renderer";
import { Card } from "~/components/card";
import { Container } from "~/components/container";
import { PageHero } from "~/components/hero/hero";
import { queryPage, queryProjects } from "~/gql/queries";
import { contentfulGqlQuery } from "~/lib/contentful";
import { contentfulImgUrl } from "~/lib/image";
import { getPageUrl } from "~/lib/navigation";
import { previewProps } from "~/lib/preview";
import { Page, Project } from "~generated/graphql";

// Ondemand revalidation
export const revalidate = process.env.NODE_ENV === "production" ? false : 0;

type PageProps = {
  params: { slug: string[] };
};

export async function generateMetadata(
  { params: { slug } }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const images = [];

  const data = await contentfulGqlQuery(queryPage, {
    slug,
    template: "Projects",
  });

  const page = data?.pageCollection.items[0] as Page;

  if (!page?.sys.id) {
    return {};
  }

  const { seoTitle, seoDescription, seoImage, hero } = page;

  const previousImages: any = (await parent).openGraph?.images || [];

  if (seoImage?.url) {
    images.unshift(seoImage.url);
  }

  return {
    title: seoTitle || hero?.title || "",
    description: seoDescription || hero?.description?.slice(0, 160) || "",
    openGraph: {
      images: [...images, ...previousImages],
    },
  };
}

export default async function ProjectsPage({ params: { slug } }: PageProps) {
  const pageData = await contentfulGqlQuery(queryPage, {
    slug,
    template: "Projects",
  });

  if (!pageData?.pageCollection?.items?.[0]?.sys?.id) {
    return notFound();
  }

  const page = pageData.pageCollection.items[0];

  if (!page?.sys.id) {
    return null;
  }

  const data = await contentfulGqlQuery(queryProjects);
  const projects = data?.projectCollection?.items || [];

  const hero = page?.hero;
  const body = page?.bodyCollection?.items;

  return (
    <main className="flex-auto">
      {hero && <PageHero {...hero} />}

      <Container className="mx-auto my-20">
        <ul className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:gap-x-2">
          {projects.map((project: Project) => (
            <Card
              as="li"
              key={project.sys.id}
              className="bg-transparent"
              {...previewProps({
                entryId: project.sys.id,
                fieldId: "title",
              })}
            >
              <Card.Image
                url={contentfulImgUrl(project.featuredImage, {
                  width: 600,
                  height: 300,
                  fit: "fill",
                })}
                width={600}
                height={300}
                alt={project.featuredImage?.title}
                imgClassName="mask mask-squircle"
              />
              <Card.Title
                href={getPageUrl(project)}
                className="text-center h-auto sm:h-6 sm:line-clamp-1"
              >
                {project.title}
              </Card.Title>
              <Card.Description className="text-center">
                {project.summary}
              </Card.Description>
              <Card.Cta className="mt-0">view more</Card.Cta>
            </Card>
          ))}
        </ul>
      </Container>

      <BlocksRenderer blocks={body as any} />
    </main>
  );
}
