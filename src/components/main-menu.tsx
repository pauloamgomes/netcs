"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface IMainMenu {
  navLinks?: {
    id?: string;
    href: string;
    label: string;
  }[];
  variant: "mobile" | "desktop";
}

export function MainMenu({ navLinks, variant }: IMainMenu) {
  const currentPath = usePathname();

  return (
    <ul
      key={currentPath}
      className={clsx(
        variant === "desktop"
          ? "menu menu-horizontal px-1 text-lg gap-x-1"
          : "menu menu-lg dropdown-content mt-2 z-[1] p-2 shadow-sm bg-base-100 rounded-box w-60"
      )}
      {...(variant === "mobile" && { tabIndex: 0 })}
    >
      {navLinks?.map(({ id, href, label }) => (
        <li key={id}>
          <Link
            href={href}
            className={clsx(
              currentPath === href && "active",
              currentPath.startsWith(`${href}/`) && "active"
            )}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
