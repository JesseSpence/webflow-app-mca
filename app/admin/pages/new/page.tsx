import Link from "next/link";
import { PageForm } from "@/components/admin/PageForm";

export default function NewPageRoute() {
  return (
    <div className="p-8 max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/pages" className="text-sm text-gray-500 hover:text-gray-700">
          ← Pages
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">New page</h1>
      </div>
      <PageForm />
    </div>
  );
}
