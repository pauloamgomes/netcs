import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "~/components/container";
import { PageHero } from "~/components/hero/hero";
import { LinkIcon } from "~/components/icons";
import { richTextEmbeddedBlocks } from "~/components/richtext-embedded-blocks";
import { queryProject } from "~/gql/queries";
import { contentfulGqlQuery } from "~/lib/contentful";
import { previewProps } from "~/lib/preview";
import { RichText } from "~/lib/rich-text";
import { formatDate } from "~/lib/utils";
import { PageHero as IPageHero } from "~generated/graphql";

// Ondemand revalidation
export const revalidate = process.env.NODE_ENV === "production" ? false : 0;

type PageProps = {
  params: { slug: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params: { slug } }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const images = [];

  const data = await contentfulGqlQuery(queryProject, {
    slug: slug.join("/"),
  });

  const page = data?.projectCollection.items[0];

  if (!page?.sys.id) {
    return {};
  }

  const previousImages: any = (await parent).openGraph?.images || [];

  if (page?.featuredImage?.url) {
    images.push(page.featuredImage.url);
  }

  const { seoTitle, seoDescription, seoImage, title, summary } = page;

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

export default async function ProjectPage({ params: { slug } }: PageProps) {
  const data = await contentfulGqlQuery(queryProject, {
    slug: slug.join("/"),
  });

  const project = data?.projectCollection?.items?.[0];

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
