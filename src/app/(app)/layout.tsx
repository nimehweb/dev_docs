import { redirect } from "next/navigation";

import { getSessionUser } from "../../lib/auth";
import AppShell from "./_components/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getSessionUser();
  if (!userId) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
