import Link from "next/link";

import { getNavigationLinkUrl } from "~/lib/navigation";
import { Maybe, NavigationLink } from "~generated/graphql";

export async function SectionReferencesAndResources({
  links,
}: {
  links?: Maybe<NavigationLink>[];
}) {
  if (!links?.length) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl mt-12">
      <h2 className="text-2xl">References and Resources:</h2>
      <div className="prose mt-4">
        <ul className="mt-4">
          {links?.map((link) => (
            <li key={link?.sys.id}>
              <Link
                href={getNavigationLinkUrl(link) || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link?.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
