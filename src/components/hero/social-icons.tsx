import clsx from "clsx";

import { Maybe, NavigationLink } from "~generated/graphql";

import { SocialLink } from "../social-links";

export function SocialIcons({
  className,
  socialLinks,
  ...props
}: {
  className?: string;
  socialLinks: Maybe<NavigationLink>[] | undefined;
}) {
  if (!socialLinks?.length) {
    return null;
  }

  return (
    <div className={clsx("flex space-x-1 items-center", className)} {...props}>
      {socialLinks.map((link) => (
        <SocialLink key={link?.sys.id} link={link} className="!w-8 !h-8" />
      ))}
    </div>
  );
}
