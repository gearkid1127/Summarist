"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../sidebar/Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // routes that should have the sidebar layout
  const exactRoutes = ["/for-you", "/library", "/settings"];
  const prefixRoutes = ["/book/", "/player"];

  const showSidebar =
    exactRoutes.includes(pathname) ||
    prefixRoutes.some((prefix) => pathname.startsWith(prefix));

  // lock body scroll ONLY when:
  // 1) we're on an app route, AND
  // 2) sidebar is open
  useEffect(() => {
    if (!showSidebar) return;

    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen, showSidebar]);

  // not an app route? render normally
  if (!showSidebar) return <>{children}</>;

  // app route? render layout
  return (
    <div className="appShell">
      {isSidebarOpen && (
        <button
          type="button"
          className="sidebarOverlay"
          aria-label="Close sidebar"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <button
        type="button"
        className="sidebarToggle"
        aria-label="Open sidebar"
        onClick={() => setIsSidebarOpen(true)}
      >
        ☰
      </button>

      <main className="appMain">{children}</main>
    </div>
  );
}
