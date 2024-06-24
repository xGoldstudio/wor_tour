import { createContext, useState } from "react";

export interface AllWorldsAnimationContextType {
  appearedTrophiesFields: Set<number>;
  addAppearedTrophiesField: (trophies: number) => void;
}

export const AllWorldsAnimationContext = createContext<AllWorldsAnimationContextType | null>(
  null
);

export default function AllWorldsAnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [appearedTrophiesFields, setAppearedTrophiesFields] = useState(
    new Set<number>()
  );

  function addAppearedTrophiesField(trophies: number) {
    setAppearedTrophiesFields((prev) => new Set([...prev, trophies]));
  }

  return (
    <AllWorldsAnimationContext.Provider
      value={{
        appearedTrophiesFields,
        addAppearedTrophiesField,
      }}
    >
      {children}
    </AllWorldsAnimationContext.Provider>
  );
}
