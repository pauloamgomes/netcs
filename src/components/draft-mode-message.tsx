"use client";

import "@contentful/live-preview/style.css";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DraftModeMessage() {
  const pathname = usePathname();

  const handleDisableDraft = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    await fetch(`/api/disable-draft?redirect=${pathname}`);

    window.location.reload();
  };

  return (
    <div className="toast toast-start z-20">
      <div className="alert alert-error shadow-lg">
        <span>Draft Mode is enabled!</span>
        <Link
          href={`/api/disable-draft?redirect=${pathname}`}
          onClick={handleDisableDraft}
          className="btn btn-sm"
        >
          Exit
        </Link>
      </div>
    </div>
  );
}
