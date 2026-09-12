"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { checkSession } from "@/lib/api";

// Le cookie de session n'est visible que du domaine du backend (cf. proxy.ts supprimé) :
// cette vérification doit donc se faire côté client, qui appelle directement ce domaine,
// plutôt que via un middleware côté frontend.
export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    checkSession().then((isAuthorized) => {
      if (cancelled) {
        return;
      }
      if (isAuthorized) {
        setAuthorized(true);
      } else {
        router.replace("/admin/login");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
