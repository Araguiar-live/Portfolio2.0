type Listener = () => void;

let active = false;
const listeners = new Set<Listener>();

/** Shared Dev inspection switch for the work toolbar and the design-file inspector. */
export function getDevInspection() {
  return active;
}

export function setDevInspection(next: boolean) {
  if (active === next) return;
  active = next;
  listeners.forEach((listener) => listener());
}

export function subscribeDevInspection(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
