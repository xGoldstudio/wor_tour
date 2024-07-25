import { createContext, ReactNode, useContext, useState } from "react";

interface EditionModeContextProps {
  editionMode: boolean;
  setEditionMode: (value: boolean) => void;
}

export const EditionModeContext = createContext<
  EditionModeContextProps | undefined
>(undefined);

export function EditionModeProvider({ children }: { children: ReactNode }) {
  const [editionMode, setEditionMode] = useState(false);
  console.log(editionMode);
  return (
    <EditionModeContext.Provider value={{ editionMode, setEditionMode }}>
      {children}
    </EditionModeContext.Provider>
  );
}

export const useEditionMode = () => {
  const context = useContext(EditionModeContext);
  if (context === undefined) {
    throw new Error("useEditionMode must be used within a EditionModeProvider");
  }
  return context;
};
