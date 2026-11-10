"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions";

export default function UserMenu({ initials }: { initials?: string }) {
  const pathname = usePathname();

  return (
    <details key={pathname} className="relative">
      <summary
        aria-label="Menu du compte"
        className="bg-brand-light text-brand-dark flex h-12 w-12 cursor-pointer list-none items-center justify-center rounded-full"
      >
        {initials || (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z" />
          </svg>
        )}
      </summary>

      <ul className="rounded-card border-grey-200 absolute right-0 z-10 mt-2 w-48 border bg-white p-2 shadow-md">
        <li>
          <Link href="/profile" className="block px-4 py-3">
            Mon compte
          </Link>
        </li>
        <li>
          <form action={logoutAction}>
            <button type="submit" className="w-full px-4 py-3 text-left">
              Se déconnecter
            </button>
          </form>
        </li>
      </ul>
    </details>
  );
}
