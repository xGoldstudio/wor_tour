import { createContext, useState } from "react";

export interface TrophiesField {
  trophies: number;
  yPosition: number;
  animate: () => void;
}

export interface TrophyBarContextType {
  trophiesFields: TrophiesField[];
  addTrophiesField: (trophies: number, yPosition: number, animate: () => void) => void;
}

export const TrophyBarContext = createContext<TrophyBarContextType | null>(
  null
);

export default function TrophyBarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [trophiesFields, setTrophiesFields] = useState<TrophiesField[]>([]);

  function addTrophiesField(trophies: number, yPosition: number, animate: () => void) {
    setTrophiesFields((trophiesFields) => {
      const isExisting = trophiesFields.find(
        (field) => field.trophies === trophies
      );
      return isExisting
        ? trophiesFields
        : [...trophiesFields, { trophies, yPosition, animate }].sort(
            (a, b) => a.trophies - b.trophies
          );
    });
  }

  return (
    <TrophyBarContext.Provider
      value={{
        trophiesFields,
        addTrophiesField,
      }}
    >
      {children}
    </TrophyBarContext.Provider>
  );
}
