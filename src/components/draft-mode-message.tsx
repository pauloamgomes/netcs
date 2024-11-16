"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function DraftModeMessage() {
  const pathname = usePathname();
  const [isCtflPreview, setIsCtflPreview] = useState(true);

  useEffect(() => {
    if (!window.location.ancestorOrigins?.[0]?.includes("contentful.com")) {
      setIsCtflPreview(false);
    }
  }, []);

  const handleDisableDraft = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    await fetch(`/api/disable-draft?redirect=${pathname}`);

    window.location.reload();
  };

  if (isCtflPreview) {
    return null;
  }

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
