import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "~/components/container";
import { PageHero } from "~/components/hero/hero";
import { LinkIcon } from "~/components/icons";
import { richTextEmbeddedBlocks } from "~/components/richtext-embedded-blocks";
import { getProject, getProjects } from "~/lib/contentful";
import { previewProps } from "~/lib/preview";
import { RichText } from "~/lib/rich-text";
import { formatDate } from "~/lib/utils";
import { PageHero as IPageHero, Project } from "~generated/graphql";

type PageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  const pages = await getProjects(true);

  return pages
    .map((page: Project) => ({
      slug: [page.slug],
    }));
}

export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;

  const project = await getProject({ slug: params.slug.join("/") });

  if (!project?.sys.id) {
    return {};
  }

  const previousImages: any = (await parent).openGraph?.images || [];

  const images = [];

  if (project?.featuredImage?.url) {
    images.push(project.featuredImage.url);
  }

  const { seoTitle, seoDescription, seoImage, title, summary } = project;

  if (seoImage?.url) {
    images.unshift(seoImage.url);
  }

  return {
    title: seoTitle || title,
    description: seoDescription || summary,
    openGraph: {
      images: [...images, ...previousImages],
    },
  };
}

export default async function ProjectPage(props: PageProps) {
  const params = await props.params;

  const project = await getProject({ slug: params.slug.join("/") });

  if (!project?.sys.id) {
    return notFound();
  }

  const heroProps = {
    sys: project.sys,
    title: project.title,
    description: project.summary,
    variant: "image-left",
    image: project.featuredImage,
    minHeight: "25%",
    variantColor: "Primary",
  } as IPageHero;

  const embeddedBlocks = await richTextEmbeddedBlocks();

  return (
    <main className="flex-auto">
      <PageHero {...heroProps} />
      <Container className="bg-primary w-full pb-6">
        <div className="mx-auto max-w-3xl order-first flex items-center justify-between font-semibold text-white">
          <time dateTime={project.publishedDate} className="flex items-center">
            <span
              {...previewProps({
                entryId: project.sys.id,
                fieldId: "publishedDate",
              })}
            >
              {formatDate(project.publishedDate)}
            </span>
          </time>
          <div>
            {project.url && (
              <Link
                href={project.url}
                target="_blank"
                className="flex items-center"
                {...previewProps({
                  entryId: project.sys.id,
                  fieldId: "url",
                })}
              >
                <LinkIcon className="h-4 w-4 mr-1" />
                {project.url
                  .replace(/^(https?:\/\/[^/]+)\//, "$1")
                  .replace(/^https?:\/\//, "")}
              </Link>
            )}
          </div>
        </div>
      </Container>
      <Container className="mt-12 mb-24">
        <div
          {...previewProps({
            entryId: project.sys.id,
            fieldId: "body",
          })}
          className="mx-auto max-w-3xl prose"
        >
          <RichText document={project?.body} blocks={embeddedBlocks} />
        </div>
      </Container>
    </main>
  );
}
