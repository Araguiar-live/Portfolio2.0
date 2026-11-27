import { createContext, useContext, type ReactNode } from "react";

export type OdicciMobileLayoutValue = {
  embed: boolean;
  toolbarBelow: boolean;
};

const OdicciMobileLayoutContext = createContext<OdicciMobileLayoutValue | null>(null);

export function OdicciMobileLayoutProvider({
  children,
  value = { embed: true, toolbarBelow: true },
}: {
  children: ReactNode;
  value?: OdicciMobileLayoutValue;
}) {
  return (
    <OdicciMobileLayoutContext.Provider value={value}>{children}</OdicciMobileLayoutContext.Provider>
  );
}

export function useOdicciMobileLayout() {
  return useContext(OdicciMobileLayoutContext);
}