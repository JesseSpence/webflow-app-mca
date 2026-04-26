"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/admin/login/actions";

const nav = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/keywords", label: "Keywords" },
  { href: "/admin/logs", label: "Publish logs" },
];

export function AdminSidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-56 flex-shrink-0 bg-gray-900 text-gray-100 flex flex-col h-screen sticky top-0">
      <div className="px-5 py-4 border-b border-gray-700">
        <span className="font-semibold text-sm tracking-wide uppercase text-gray-400">MCA Admin</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
              isActive(href, exact)
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-700 space-y-2">
        {userEmail && (
          <p className="text-xs text-gray-400 truncate">{userEmail}</p>
        )}
        <form action={signOut}>
          <button
            type="submit"
            className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
