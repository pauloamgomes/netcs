import { gql } from "graphql-request";

import BlocksRenderer from "~/components/blocks-renderer";
import { Card } from "~/components/card";
import { Container } from "~/components/container";
import { PageHero } from "~/components/hero/hero";
import { FragmentAsset } from "~/gql/fragments";
import { contentfulGqlQuery } from "~/lib/contentful";
import { contentfulImgUrl } from "~/lib/image";
import { getPageUrl } from "~/lib/navigation";
import { previewProps } from "~/lib/preview";
import { Page, Project } from "~generated/graphql";

const queryProjects = gql`
  ${FragmentAsset}

  query queryProjects($limit: Int = 100, $preview: Boolean = false) {
    projectCollection(
      limit: $limit
      order: publishedDate_DESC
      preview: $preview
    ) {
      items {
        __typename
        sys {
          id
        }
        publishedDate
        title
        slug
        summary
        featuredImage {
          ...FragmentAsset
        }
      }
    }
  }
`;

export async function ProjectsTemplate({ page }: { page: Page | undefined }) {
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
