"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // 1. Tell the component we are now safely in the browser
    setIsMounted(true);

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      router.push("/login");
    } else {
      // 2. This is the "cascading" render, but it's necessary
      // because we moved from "Server" state to "Client" state.
      setAuthorized(true);
    }
  }, [router]);

  // If we aren't in the browser yet, show nothing
  if (!isMounted) return null;

  // If we are in the browser but not authorized, show nothing (while router redirects)
  if (!authorized) return null;

  return <>{children}</>;
}
