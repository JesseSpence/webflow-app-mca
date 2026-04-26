import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/server-auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = { title: "MCA Admin" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar userEmail={user.email} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
