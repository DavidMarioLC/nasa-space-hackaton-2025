// hooks/useInitAuth.ts
"use client";
import { useEffect } from "react";
import { useAuthStore } from "../store";

export function useInitAuth() {
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      login(JSON.parse(userData), token);
    }
  }, [login]);
}
