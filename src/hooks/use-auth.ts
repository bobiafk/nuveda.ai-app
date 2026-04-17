"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ef-auth";
const EVENT_NAME = "ef-auth-change";

export interface AuthUser {
  name: string;
  email: string;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface StoredAuth {
  user: AuthUser;
}

// Cached snapshot — only replaced when the raw JSON string changes.
let cachedRaw: string | null = null;
let cachedValue: StoredAuth | null = null;

function readStored(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedValue;
    cachedRaw = raw;
    if (!raw) {
      cachedValue = null;
      return null;
    }
    const parsed = JSON.parse(raw) as StoredAuth;
    cachedValue = parsed?.user?.email ? parsed : null;
    return cachedValue;
  } catch {
    cachedRaw = null;
    cachedValue = null;
    return null;
  }
}

function writeStored(value: StoredAuth | null) {
  if (typeof window === "undefined") return;
  // Bust the cache before dispatching so the next snapshot read picks it up.
  cachedRaw = undefined as unknown as null;
  if (value === null) {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }
  window.dispatchEvent(new Event(EVENT_NAME));
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "User";
  return (
    local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ") || "User"
  );
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function useAuth() {
  // Manual subscription — re-reads from localStorage on each auth event.
  const [stored, setStored] = useState<StoredAuth | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStored(readStored());

    const handle = () => setStored(readStored());
    window.addEventListener(EVENT_NAME, handle);
    window.addEventListener("storage", handle);
    return () => {
      window.removeEventListener(EVENT_NAME, handle);
      window.removeEventListener("storage", handle);
    };
  }, []);

  const status: AuthStatus = !mounted
    ? "loading"
    : stored
      ? "authenticated"
      : "unauthenticated";

  const signIn = useCallback(async (email: string, _password: string) => {
    void _password;
    await delay(600);
    const user: AuthUser = { name: nameFromEmail(email), email };
    writeStored({ user });
    return user;
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, _password: string) => {
      void _password;
      await delay(600);
      const user: AuthUser = {
        name: name.trim() || nameFromEmail(email),
        email,
      };
      writeStored({ user });
      return user;
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    await delay(600);
    const user: AuthUser = {
      name: "Google User",
      email: "you@gmail.com",
    };
    writeStored({ user });
    return user;
  }, []);

  const signOut = useCallback(() => {
    writeStored(null);
  }, []);

  return {
    user: stored?.user ?? null,
    status,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };
}

export { STORAGE_KEY as AUTH_STORAGE_KEY };
