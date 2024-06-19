import { createContext, useState } from "react";

export interface TrophiesField {
  trophies: number;
  yPosition: number;
}

export interface TrophyBarContextType {
  trophiesFields: TrophiesField[];
  addTrophiesField: (trophies: number, yPosition: number) => void;
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

  function addTrophiesField(trophies: number, yPosition: number) {
    setTrophiesFields((trophiesFields) => {
      const isExisting = trophiesFields.find(
        (field) => field.trophies === trophies
      );
      return isExisting
        ? trophiesFields
        : [...trophiesFields, { trophies, yPosition }];
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
