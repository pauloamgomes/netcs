import { BlocksNewsletterSignup } from "~generated/graphql";

import { Container } from "../container";
import { SectionHeading } from "../heading";
import { FormNewsletterSignup } from "../newsletter/form";

export async function BlockNewsletterSignup({
  block,
}: {
  block: BlocksNewsletterSignup;
}) {
  return (
    <Container className="mx-auto py-8">
      <SectionHeading
        id={block.sys.id}
        title={block.title}
        summary={block.description}
      />
      <FormNewsletterSignup block={block} />
    </Container>
  );
}
