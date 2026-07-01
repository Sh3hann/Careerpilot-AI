import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main style={{
        flex: 1,
        overflow: "auto",
        minWidth: 0,
        maxHeight: "100vh",
      }}>
        {children}
      </main>
    </div>
  );
}
