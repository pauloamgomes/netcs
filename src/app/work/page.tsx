import clsx from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import BlocksRenderer from "~/components/blocks-renderer";
import { Container } from "~/components/container";
import { PageHero } from "~/components/hero/hero";
import { queryPage, queryWorks } from "~/gql/queries";
import { contentfulGqlQuery } from "~/lib/contentful";
import { contentfulImgUrl } from "~/lib/image";
import { getPageUrl } from "~/lib/navigation";
import { previewProps } from "~/lib/preview";
import { Maybe, Page, Skills, WorkExperience } from "~generated/graphql";

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

  const data = await contentfulGqlQuery(queryPage, {
    slug,
    template: "Work Experience",
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

export default async function WorksPage({ params: { slug } }: PageProps) {
  const pageData = await contentfulGqlQuery(queryPage, {
    slug,
    template: "Work Experience",
  });

  const page = pageData.pageCollection.items[0];

  if (!page?.sys.id) {
    return notFound();
  }

  const data = await contentfulGqlQuery(queryWorks);
  const roles = data?.workExperienceCollection?.items || [];

  const hero = page?.hero;
  const body = page?.bodyCollection?.items;

  return (
    <main className="flex-auto">
      {hero && <PageHero {...hero} />}

      <Container className="mx-auto my-20">
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
          {roles?.map((role: WorkExperience, idx: number) => (
            <li key={role.sys.id}>
              {idx > 0 && <hr className="bg-primary" />}
              <div className="timeline-middle rounded-2xl border-4 border-primary">
                <Image
                  src={contentfulImgUrl(role.logo, {
                    width: 60,
                    height: 60,
                    fit: "scale",
                  })}
                  alt={role.logo?.title || ""}
                  width={60}
                  height={60}
                  className="rounded-xl"
                  unoptimized
                />
              </div>
              <div
                {...previewProps({
                  entryId: role.sys.id,
                  fieldId: "role",
                })}
                className={clsx(
                  "mb-10 p-5",
                  idx % 2 === 0 ? "timeline-start md:text-end" : "timeline-end"
                )}
              >
                <div className="font-bold text-xl font-heading">
                  <span>{new Date(role?.startDate).getFullYear()}</span>{" "}
                  <span aria-hidden="true">—</span>{" "}
                  <span>
                    {role?.currentWork
                      ? "Present"
                      : new Date(role?.endDate).getFullYear()}
                  </span>
                </div>
                <p className="text-xl font-heading">{role.companyName}</p>
                <p className="text-2xl font-black font-heading">{role.role}</p>
                <p className="my-2">{role.summary}</p>
                <p>
                  {role?.skillsCollection?.items?.map(
                    (skill: Maybe<Skills>) => (
                      <span
                        key={skill?.sys.id}
                        className="badge badge-ghost mr-2 text-xs"
                      >
                        {skill?.name}
                      </span>
                    )
                  )}
                </p>
                <p className="mt-4">
                  <Link
                    className="btn btn-ghost btn-xs"
                    href={getPageUrl(role) || "#"}
                  >
                    View role details
                  </Link>
                </p>
              </div>
              <hr className="bg-primary" />
            </li>
          ))}
        </ul>
      </Container>

      <BlocksRenderer blocks={body as any} />
    </main>
  );
}
