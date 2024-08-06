import { ReactNode, useState } from "react";
import { EditionModeContext } from "./UseEditionMode";

export function EditionModeProvider({ children }: { children: ReactNode }) {
  const [editionMode, setEditionMode] = useState(false);
  return (
    <EditionModeContext.Provider value={{ editionMode, setEditionMode }}>
      {children}
    </EditionModeContext.Provider>
  );
}
