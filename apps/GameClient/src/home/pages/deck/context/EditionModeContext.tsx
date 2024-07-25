import React, { createContext, useState, ReactNode, useContext } from "react";

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
    <EditionModeContext.Provider
      value={{
        editionMode,
        setEditionMode: (value: boolean) => {
          console.log("1 === ", value);
          setEditionMode(value);
          console.log("2 === ", editionMode);
        },
      }}
    >
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
