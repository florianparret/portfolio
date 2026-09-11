"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Button variant="secondary" onClick={handleLogout} className="w-fit">
      Se déconnecter
    </Button>
  );
}
