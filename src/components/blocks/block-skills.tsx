import clsx from "clsx";

import { BlocksSkills, Skills as ISkill } from "~generated/graphql";

import { Container } from "../container";
import { SectionHeading } from "../heading";
import { Skill } from "../skill";

export async function BlockSkills({
  block,
  className,
}: {
  block: BlocksSkills;
  className?: string;
}) {
  const { title, summary, showOnlySkills, hideRatings, skillsCollection } =
    block;
  const skills = skillsCollection?.items as ISkill[];

  return (
    <Container
      className={clsx("mx-auto", className, showOnlySkills ? "-my-8" : "my-16")}
    >
      {!showOnlySkills && (
        <SectionHeading id={block.sys.id} title={title} summary={summary} />
      )}

      <div className="mx-auto w-full flex justify-evenly flex-wrap gap-y-2 gap-x-1">
        {skills?.map((skill: ISkill) => (
          <div className="stats shadow m-2" key={skill.sys.id}>
            <Skill {...skill} hideRatings={hideRatings || false} />
          </div>
        ))}
      </div>
    </Container>
  );
}
