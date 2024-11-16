import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import BlocksRenderer from "~/components/blocks-renderer";
import { Card } from "~/components/card";
import { Container } from "~/components/container";
import { PageHero } from "~/components/hero/hero";
import { getPage, getProjects } from "~/lib/contentful";
import { contentfulImgUrl } from "~/lib/image";
import { getPageUrl } from "~/lib/navigation";
import { previewProps } from "~/lib/preview";
import { Project } from "~generated/graphql";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";

export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;

  const page = await getPage({ slug: params.slug, template: "Projects" });

  if (!page?.sys.id) {
    return {};
  }

  const { seoTitle, seoDescription, seoImage, hero } = page;

  const images = [];

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

export default async function ProjectsPage(props: PageProps) {
  const params = await props.params;

  const page = await getPage({ slug: params.slug, template: "Projects" });

  if (!page?.sys.id) {
    return notFound();
  }

  const projects = await getProjects();

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

      <BlocksRenderer id={page.sys.id} blocks={body as any} />
    </main>
  );
}
