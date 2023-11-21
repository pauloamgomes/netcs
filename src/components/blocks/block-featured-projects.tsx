import clsx from "clsx";

import { contentfulImgUrl } from "~/lib/image";
import { getPageUrl } from "~/lib/navigation";
import { previewProps } from "~/lib/preview";
import { getImageMaskClass } from "~/lib/utils";
import { BlocksFeaturedProjects, Project } from "~generated/graphql";

import { Card } from "../card";
import { Container } from "../container";
import { SectionHeading } from "../heading";
import { ChevronRightIcon } from "../icons";

export async function BlockFeaturedProjects({
  block,
}: {
  block: BlocksFeaturedProjects;
}) {
  const {
    sys,
    title,
    summary,
    projectsCollection,
    viewAllPage,
    variant,
    projectImageMask = "decagon",
  } = block;
  const projects = (projectsCollection?.items || []) as Project[];
  const viewAllPageUrl = getPageUrl(viewAllPage);

  return (
    <Container
      className={clsx(
        "mx-auto py-16",
        variant === "Dark" ? "bg-base-200" : "bg-base-100"
      )}
    >
      <SectionHeading id={sys.id} title={title} summary={summary} />

      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-2">
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
              imgClassName={getImageMaskClass(projectImageMask)}
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
          </Card>
        ))}
        {viewAllPageUrl && (
          <Card
            as="li"
            className="bg-transparent align-middle justify-center items-center"
            {...previewProps({
              entryId: sys.id,
              fieldId: "viewAllPageUrl",
            })}
          >
            <Card.Title href={viewAllPageUrl} className="text-center h-auto">
              <span className="btn btn-ghost btn-sm">
                View all projects
                <ChevronRightIcon className="h-4 w-4 stroke-current" />
              </span>
            </Card.Title>
          </Card>
        )}
      </ul>
    </Container>
  );
}
