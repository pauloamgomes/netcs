"use client";

export function ViewCounterCapture({ slug }: { slug: string }) {
  return (
    <style jsx global>{`
      .article:hover {
        border-image: url("/api/views/${slug}");
      }
    `}</style>
  );
}
