"use client";

import { useState } from "react";

import { RichText } from "~/lib/rich-text";
import { Maybe, Text } from "~generated/graphql";

export function Accordion({ items }: { items?: Maybe<Text>[] }) {
  const [open, setOpen] = useState([1]);

  const toggle = (idx: number) => {
    if (open.includes(idx)) {
      setOpen((prev) => prev.filter((i) => i !== idx));
    } else {
      setOpen((prev) => [...prev, idx]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-4">
      {items?.map((item, idx) => (
        <div
          key={item?.sys.id}
          className="collapse collapse-plus bg-base-200"
          onClick={() => toggle(idx + 1)}
        >
          <input
            type="radio"
            name={`accordion-${item?.sys.id}-${idx}`}
            checked={open.includes(idx + 1)}
            onChange={() => null}
          />
          <div className="collapse-title text-xl font-medium">
            {item?.title}
          </div>
          <div className="collapse-content">
            <RichText document={item?.text} />
          </div>
        </div>
      ))}
    </div>
  );
}
