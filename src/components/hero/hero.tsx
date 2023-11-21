import { PageHero as IPageHero } from "~generated/graphql";

import { WithBackgroundImageHero } from "./background-image";
import { WithSideImageHero } from "./side-image";
import { WithoutImageHero } from "./without-image";

export function PageHero({
  variant,
  className,
  ...props
}: { className?: string } & IPageHero) {
  switch (variant?.toLowerCase()?.replace(/ /g, "-")) {
    case "image-left":
      return (
        <WithSideImageHero
          variant={variant}
          className={className}
          imageLeft
          {...props}
        />
      );
    case "image-right":
      return (
        <WithSideImageHero
          variant={variant}
          className={className}
          imageLeft={false}
          {...props}
        />
      );
    case "background-image":
      return <WithBackgroundImageHero className={className} {...props} />;
    case "without-image":
      return <WithoutImageHero className={className} {...props} />;
  }

  return null;
}
