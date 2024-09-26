import { createContext, useState } from "react";
import { Tabs } from "./Home";

export interface HomeTabContextType {
	currentTab: Tabs;
	setCurrentTab: (tab: Tabs) => void;
}

export const HomeTabContext = createContext<HomeTabContextType | null>(
  null
);

export default function HomeTabContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTab, setCurrentTab] = useState<Tabs>("home");

  return (
    <HomeTabContext.Provider
      value={{
        currentTab,
        setCurrentTab,
      }}
    >
      {children}
    </HomeTabContext.Provider>
  );
}
