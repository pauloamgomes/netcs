import Link from "next/link";

export function TextWithLinks({ text }: { text?: string }) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text?.split(urlRegex);

  return (
    <>
      {parts
        ?.map((part, index) => {
          if (part.match(urlRegex)) {
            return (
              <Link
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1"
              >
                {part}
              </Link>
            );
          }
          return part && <span key={index}>{part}</span>;
        })
        .filter((part) => Boolean(part))}
    </>
  );
}
