"use client";

import { useEffect } from "react";

export default function SWRegistration() {
  useEffect(() => {
    // Only run in the browser
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // It's safer to register after the window has fully loaded
      const register = async () => {
        try {
          const reg = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          });
          console.log("Service Worker registered with scope:", reg.scope);
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      };

      window.addEventListener("load", register);
      // If the window is already loaded, register immediately
      if (document.readyState === "complete") {
        register();
      }
    }
  }, []);

  return null;
}
