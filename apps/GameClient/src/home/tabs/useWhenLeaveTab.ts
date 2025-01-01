import { useContext, useState } from "react";
import { Tabs } from "../Home";
import { HomeTabContext, HomeTabContextType } from "../HomeTabContext";

export function useWhenLeaveTab(tab: Tabs, callback: () => void) {
  const { currentTab } = useContext(
    HomeTabContext
  ) as unknown as HomeTabContextType;
  const [isActive, setIsActive] = useState(currentTab === tab);
  if (currentTab === tab) {
    if (!isActive) setIsActive(true);
  } else if (isActive) {
    setIsActive(false);
    callback();
  }
}