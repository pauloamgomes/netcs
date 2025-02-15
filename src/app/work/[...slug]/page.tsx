import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Container } from "~/components/container";
import { PageHero } from "~/components/hero/hero";
import { richTextEmbeddedBlocks } from "~/components/richtext-embedded-blocks";
import { getWork, getWorks } from "~/lib/contentful";
import { contentfulImgUrl } from "~/lib/image";
import { previewProps } from "~/lib/preview";
import { RichText } from "~/lib/rich-text";
import { PageHero as IPageHero, Skills, WorkExperience } from "~generated/graphql";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  const pages = await getWorks(true);

  return pages
    .map((page: WorkExperience) => ({
      slug: [page.slug],
    }));
}

export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;

  const work = await getWork({ slug: params.slug.join("/") })

  if (!work?.sys.id) {
    return {};
  }

  const { seoTitle, seoDescription, seoImage, summary, role, companyName } =
    work;

  const previousImages: any = (await parent).openGraph?.images || [];

  const images = [];

  if (seoImage?.url) {
    images.unshift(seoImage.url);
  }

  return {
    title: seoTitle || `${role} - ${companyName}`,
    description: seoDescription || summary,
    openGraph: {
      images: [...images, ...previousImages],
    },
  };
}

export default async function BasicPage(props: PageProps) {
  const params = await props.params;

  const work = await getWork({ slug: params.slug.join("/") })

  if (!work?.sys.id) {
    return notFound();
  }

  const embeddedBlocks = await richTextEmbeddedBlocks();

  const startDate = new Date(work?.startDate).getFullYear();
  const endDate = work?.currentWork
    ? "Present"
    : new Date(work?.endDate).getFullYear();

  const heroProps = {
    sys: work.sys,
    title: work.role,
    eyebrow: `${startDate} — ${endDate}`,
    description: work.summary,
    variant: "without-image",
    image: work.logo,
    variantColor: "Dark",
  } as IPageHero;

  const skills: Skills[] = work?.skillsCollection?.items?.filter((item: Skills) => !!item) || [];

  return (
    <main className="flex-auto">
      <PageHero className="pb-0" {...heroProps} />

      <Container className="bg-base-300 w-full pb-8 -mt-8">
        <div className="mx-auto max-w-3xl order-first flex flex-col items-center justify-center font-semibold text-base">
          <div className="flex items-center">
            <Image
              {...previewProps({
                entryId: work.sys.id,
                fieldId: "logo",
              })}
              src={contentfulImgUrl(work.logo, {
                width: 32,
                height: 32,
                fit: "scale",
              })}
              alt={work.logo?.title || ""}
              width={32}
              height={32}
              className="rounded-full border border-white/50"
              unoptimized
            />
            <span
              {...previewProps({
                entryId: work.sys.id,
                fieldId: "companyName",
              })}
              className="ml-2 text-2xl"
            >
              {work.companyName}
            </span>
          </div>
          <div
            {...previewProps({
              entryId: work.sys.id,
              fieldId: "skills",
            })}
            className="flex flex-wrap justify-center items-center gap-x-2 gap-y-4 mt-8"
          >
            {skills?.map((skill) => (
              <span key={skill?.sys.id} className="badge">
                {skill?.name}
              </span>
            ))}
          </div>
        </div>
      </Container>

      <Container className="mt-12 mb-24">
        <div
          {...previewProps({
            entryId: work.sys.id,
            fieldId: "body",
          })}
          className="mx-auto max-w-3xl prose"
        >
          <RichText document={work?.body} blocks={embeddedBlocks} />
        </div>
      </Container>
    </main>
  );
}
