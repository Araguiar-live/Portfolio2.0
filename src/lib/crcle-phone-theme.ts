import { useCallback, useSyncExternalStore } from "react";

/** Shared across CRCLE tabs so the sun toggle survives Signal Home → Messaging Hub. */
let light = true;
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot() {
  return light;
}

export function setCrclePhoneLight(next: boolean) {
  if (light === next) return;
  light = next;
  listeners.forEach((notify) => notify());
}

export function useCrclePhoneLight() {
  const isLight = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const toggleLight = useCallback(() => {
    setCrclePhoneLight(!light);
  }, []);
  const setLight = useCallback((next: boolean) => {
    setCrclePhoneLight(next);
  }, []);
  return [isLight, toggleLight, setLight] as const;
}
