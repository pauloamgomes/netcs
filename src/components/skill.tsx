import clsx from "clsx";
import Link from "next/link";

import { previewProps } from "~/lib/preview";
import { Skills as ISkill } from "~generated/graphql";

import { LinkIcon } from "./icons";

const levels = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export async function Skill({
  sys,
  name,
  rating,
  externalUrl,
  summary,
  hideRatings = false,
}: { hideRatings?: boolean } & ISkill) {
  return (
    <div className="stat px-4 bg-base-300">
      <div
        {...previewProps({
          entryId: sys.id,
          fieldId: "name",
        })}
        className="stat-title flex justify-between text-base-content font-semibold"
      >
        {name}
        {externalUrl && (
          <Link
            href={externalUrl}
            target="_blank"
            className="ml-1 btn btn-xs"
            aria-label={`Link to ${name}`}
          >
            <LinkIcon className="inline-block w-3 h-3" />
          </Link>
        )}
      </div>
      {!hideRatings && Number(rating) > 0 ? (
        <div className="stat-value">
          <div className="rating my-2">
            {levels.map((level, idx) => (
              <div
                key={level}
                className={clsx(
                  "w-3 h-6 mask mask-star-2",
                  idx % 2 === 0 ? "mask-half-1" : "mask-half-2 mr-1",
                  level <= (rating || 0) ? "bg-orange-400" : "bg-orange-200"
                )}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="stat-desc text-sm sm:min-h-16 w-full sm:w-52 md:w-72 lg:w-60">
        <p className="whitespace-pre-wrap mb-1 text-base-content">{summary}</p>
      </div>
    </div>
  );
}
