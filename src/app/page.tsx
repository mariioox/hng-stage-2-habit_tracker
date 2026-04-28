"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/shared/SplashScreen";
import { STORAGE_KEYS } from "@/lib/constants";

export default function RootPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Start the mandatory splash delay
    const splashTimer = setTimeout(() => {
      const sessionRaw = localStorage.getItem(STORAGE_KEYS.SESSION);

      if (sessionRaw) {
        try {
          const session = JSON.parse(sessionRaw);
          if (session?.userId) {
            router.replace("/dashboard");
            return;
          }
        } catch (e) {
          localStorage.removeItem(STORAGE_KEYS.SESSION);
        }
      }

      // Default to login if no session
      router.replace("/login");
    }, 1500); // 1.5s delay satisfies Section 7.2

    return () => clearTimeout(splashTimer);
  }, [router]);

  // Prevent server-side content from rendering before the browser is ready
  if (!mounted) return null;

  return <SplashScreen />;
}
