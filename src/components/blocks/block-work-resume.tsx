import Image from "next/image";
import Link from "next/link";

import { contentfulImgUrl } from "~/lib/image";
import { getPageUrl } from "~/lib/navigation";
import { previewProps } from "~/lib/preview";
import { BlocksWorkResume } from "~generated/graphql";

import { Container } from "../container";
import { SectionHeading } from "../heading";
import { ChevronRightIcon } from "../icons";

export async function BlockWorkResume({ block }: { block: BlocksWorkResume }) {
  const { sys, title, summary, worksCollection, viewAllPage } = block;
  const viewAllPageUrl = getPageUrl(viewAllPage);

  return (
    <Container className="mx-auto py-16 w-full">
      <SectionHeading id={sys.id} title={title} summary={summary} />

      <ol className="mt-6 space-y-8">
        {worksCollection?.items?.map((role) => (
          <li
            key={role?.sys.id}
            className="flex gap-4 p-4 bg-base-200 rounded-lg shadow-sm"
            {...previewProps({
              entryId: role?.sys.id,
              fieldId: "role",
            })}
          >
            <div className="relative flex flex-none items-center justify-center rounded-full shadow-md h-12">
              {role?.logo?.url ? (
                <Image
                  src={contentfulImgUrl(role.logo, {
                    width: 48,
                    height: 48,
                    fit: "scale",
                  })}
                  alt={role.logo.title || ""}
                  width={48}
                  height={48}
                  unoptimized
                />
              ) : null}
            </div>
            <dl className="flex flex-auto flex-wrap gap-x-2">
              <dt className="sr-only">Company</dt>
              <dd className="w-full flex-none text-md font-medium">
                {role?.companyName}
              </dd>
              <dt className="sr-only">Role</dt>
              <dd className="text-lg">
                <p>{role?.role}</p>
                <p className="my-2 max-w-xs md:max-w-sm lg:max-w-xl text-sm">
                  {role?.summary}
                </p>
                <p>
                  {role?.skillsCollection?.items?.map((skill) => (
                    <span
                      key={skill?.sys.id}
                      className="badge badge-base-300 mr-2 text-xs"
                    >
                      {skill?.name}
                    </span>
                  ))}
                </p>
              </dd>
              <dt className="sr-only">Date</dt>
              <dd
                className="ml-auto text-md"
                aria-label={`${role?.startDate} until ${role?.endDate}`}
              >
                <span>{new Date(role?.startDate).getFullYear()}</span>{" "}
                <span aria-hidden="true">—</span>{" "}
                <span>
                  {role?.currentWork
                    ? "Present"
                    : new Date(role?.endDate).getFullYear()}
                </span>
              </dd>
              <dt className="sr-only">Skills</dt>
            </dl>
          </li>
        ))}
      </ol>
      {viewAllPageUrl && (
        <div
          {...previewProps({
            entryId: sys.id,
            fieldId: "viewAllPageUrl",
          })}
          className="text-center mt-4"
        >
          <Link href={viewAllPageUrl} className="btn btn-ghost btn-sm">
            View all work experience
            <ChevronRightIcon className="h-4 w-4 stroke-current" />
          </Link>
        </div>
      )}
    </Container>
  );
}
