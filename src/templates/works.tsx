import { gql } from "graphql-request";
import Image from "next/image";
import Link from "next/link";

import BlocksRenderer from "~/components/blocks-renderer";
import { Container } from "~/components/container";
import { PageHero } from "~/components/hero/hero";
import { FragmentAsset } from "~/gql/fragments";
import { contentfulGqlQuery } from "~/lib/contentful";
import { contentfulImgUrl } from "~/lib/image";
import { getPageUrl } from "~/lib/navigation";
import { previewProps } from "~/lib/preview";
import { Maybe, Page, Skills, WorkExperience } from "~generated/graphql";

const queryWorks = gql`
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

export async function WorksTemplate({ page }: { page: Page | undefined }) {
  if (!page?.sys.id) {
    return null;
  }

  const data = await contentfulGqlQuery(queryWorks);
  const roles = data?.workExperienceCollection?.items || [];

  const hero = page?.hero;
  const body = page?.bodyCollection?.items;

  return (
    <main className="flex-auto">
      {hero && <PageHero {...hero} />}

      <Container className="mx-auto my-20">
        <div className="mx-auto max-w-xl">
          <ul className="steps steps-vertical w-full">
            {roles?.map((role: WorkExperience) => (
              <li
                key={role.sys.id}
                className="step step-secondary w-full min-h-60"
                data-content="●"
              >
                <div className="absolute z-10 -ml-3 bg-secondary rounded-2xl p-2">
                  <Image
                    src={contentfulImgUrl(role.logo, {
                      width: 48,
                      height: 48,
                      fit: "scale",
                    })}
                    alt={role.logo?.title || ""}
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                </div>
                <div className="pl-12 flex w-full items-center py-4">
                  <div
                    {...previewProps({
                      entryId: role.sys.id,
                      fieldId: "role",
                    })}
                    className="w-full md:max-w-xl lg:max-w-2xl text-left mr-12"
                  >
                    <p className="font-bold">
                      <span>{new Date(role?.startDate).getFullYear()}</span>{" "}
                      <span aria-hidden="true">—</span>{" "}
                      <span>
                        {role?.currentWork
                          ? "Present"
                          : new Date(role?.endDate).getFullYear()}
                      </span>
                    </p>
                    <h2 className="text-xl">{role.companyName}</h2>
                    <h3 className="text-2xl">{role.role}</h3>
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
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <BlocksRenderer blocks={body as any} />
    </main>
  );
}
