import clsx from "clsx";
import Link from "next/link";

import { Maybe, NavigationLink } from "~generated/graphql";

import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  TwitterIcon,
} from "./icons";

const AvailableSocialIcons: Record<string, any> = {
  GitHubIcon: GitHubIcon,
  InstagramIcon: InstagramIcon,
  LinkedInIcon: LinkedInIcon,
  XIcon: TwitterIcon,
  MailIcon: MailIcon,
};

interface ISocialLink {
  className?: string;
  link?: Maybe<NavigationLink> | undefined;
}

export function SocialLink({ className, link }: ISocialLink) {
  const { icon, externalUrl, label } = link || {};

  if (!icon || !externalUrl || !AvailableSocialIcons[icon] || !label) {
    return null;
  }

  const Icon = AvailableSocialIcons[icon];

  return (
    <Link
      className="rounded-full btn btn-ghost"
      aria-label={label}
      href={externalUrl}
      target="_blank"
    >
      <Icon className={clsx("h-6 w-6", className)} />
    </Link>
  );
}
