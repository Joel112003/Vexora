import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

/**
 * Call once at app root. Silently restores the session from the
 * server-side httpOnly refresh cookie on every page load.
 *
 * React StrictMode (dev) runs the effect twice:
 *  - Mount 1: fetch starts → cleanup aborts it → AbortError caught → ignored
 *  - Mount 2: fetch starts again → succeeds → setAuth called
 * In production (no StrictMode) the effect only runs once — same result.
 *
 * NOTE: Do NOT add a "calledRef" guard here. React StrictMode reuses the
 * same ref instance across its unmount/remount cycle, so calledRef.current
 * would be `true` on the second mount and block the actual fetch — leaving
 * isHydrating = true forever and showing a permanent loading screen.
 */
export const useInitAuth = () => {
  useEffect(() => {
    const controller = new AbortController();

    // Safety timeout: if the server never responds, unblock the app after 6s
    const timeout = setTimeout(() => {
      controller.abort();
      useAuthStore.getState().setHydrating(false);
    }, 6_000);

    const VITE_API_URL = import.meta.env.VITE_API_URL ?? "";

    fetch(`${VITE_API_URL}/auth/refresh`, {
      method:      "POST",
      credentials: "include",
      headers:     { "Content-Type": "application/json" },
      body:        JSON.stringify({}),
      signal:      controller.signal,
    })
      .then(async (res) => {
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`Refresh ${res.status}`);
        const json    = await res.json();
        const payload = json.data ?? json;
        const { accessToken, user } = payload;
        if (user && accessToken) {
          useAuthStore.getState().setAuth(user, accessToken);
        } else {
          console.warn("[auth] Unexpected refresh shape:", json);
          useAuthStore.getState().setHydrating(false);
        }
      })
      .catch((err) => {
        clearTimeout(timeout);
        if (err.name === "AbortError") return; // StrictMode first-mount abort — ignore
        console.warn("[auth] Session restore failed:", err.message);
        useAuthStore.getState().setHydrating(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);
};
