import Link from "next/link";

import type { PageRecord } from "@/lib/content/types";

interface SeoGroupIndexProps {
  title: string;
  description: string;
  pages: PageRecord[];
}

export function SeoGroupIndex({ title, description, pages }: SeoGroupIndexProps) {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-3 text-slate-600">{description}</p>

      <ul className="mt-8 space-y-3">
        {pages.map((page) => (
          <li key={page.id} className="rounded-md border border-slate-200 p-4">
            <Link href={page.full_path} className="font-medium text-slate-900 hover:underline">
              {page.title}
            </Link>
            <p className="mt-1 text-sm text-slate-500">{page.full_path}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
