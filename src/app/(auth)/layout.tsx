import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getSessionUser } from "../../lib/auth";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const userId = await getSessionUser();
  if (userId) {
    redirect("/dashboard");
  }

  return children;
}
