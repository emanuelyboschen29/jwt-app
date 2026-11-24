
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardSidebar from "./dashboard-sidebar";

export const instant = false;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-shell">
      <Suspense fallback={<aside className="dashboard-sidebar" aria-hidden="true" />}>
        <AuthenticatedSidebar />
      </Suspense>
      <section className="dashboard-content">{children}</section>
    </div>
  );
}

async function AuthenticatedSidebar() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  return <DashboardSidebar name={user.name} role={user.role} />;
}