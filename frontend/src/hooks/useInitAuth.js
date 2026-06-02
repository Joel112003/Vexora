import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export const useInitAuth = () => {
  useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
      useAuthStore.getState().setHydrating(false);
    }, 6_000);

    const VITE_API_URL = import.meta.env.VITE_API_URL ?? "";

    fetch(`${VITE_API_URL}/v1/auth/refresh`, {
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
        if (err.name === "AbortError") return;
        console.warn("[auth] Session restore failed:", err.message);
        useAuthStore.getState().setHydrating(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);
};
