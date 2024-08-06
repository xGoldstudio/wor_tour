import { createContext, useContext } from "react";

interface EditionModeContextProps {
  editionMode: boolean;
  setEditionMode: (value: boolean) => void;
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
