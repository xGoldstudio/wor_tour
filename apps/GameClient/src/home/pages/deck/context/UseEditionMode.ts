import { createContext, useContext } from "react";
import { PlayerCardCollectionInfo } from "../cardFilters";

interface EditionModeContextProps {
  editionMode: boolean;
  setEditionMode: (value: boolean) => void;
  replacingCard: PlayerCardCollectionInfo | null;
  setReplacingCard: (value: PlayerCardCollectionInfo | null) => void;
}

export const EditionModeContext = createContext<
  EditionModeContextProps | undefined
>(undefined);

export const useEditionMode = () => {
  const context = useContext(EditionModeContext);
  if (context === undefined) {
    throw new Error("useEditionMode must be used within a EditionModeProvider");
  }
  return context;
};
