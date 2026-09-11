"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <div
        key={`${pathname}-glow`}
        aria-hidden="true"
        className="page-transition-glow pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.25),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(129,140,248,0.3),transparent_60%)]"
      />
      <div key={pathname} className="page-transition flex flex-1 flex-col">
        {children}
      </div>
    </>
  );
}
