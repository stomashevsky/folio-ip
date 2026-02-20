"use client";

import { useSyncExternalStore, useCallback } from "react";

export type Environment = "sandbox" | "production";

let currentEnvironment: Environment = "sandbox";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Environment {
  return currentEnvironment;
}

function setEnvironment(env: Environment) {
  currentEnvironment = env;
  listeners.forEach((l) => l());
}

export function useEnvironment() {
  const environment = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const toggle = useCallback(() => {
    setEnvironment(environment === "sandbox" ? "production" : "sandbox");
  }, [environment]);

  return { environment, setEnvironment, toggle };
}
