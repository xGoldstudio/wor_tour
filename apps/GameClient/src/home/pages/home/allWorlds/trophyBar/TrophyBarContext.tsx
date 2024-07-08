import { createContext, useState } from "react";

export interface AllWorldsAnimationContextType {
  appearedTrophiesFields: Set<number>;
  addAppearedTrophiesField: (trophies: number) => void;
  state: "normal" | "tier" | "world";
  setState: (state: "normal" | "tier" | "world") => void;
}

export const AllWorldsAnimationContext = createContext<AllWorldsAnimationContextType | null>(
  null
);

export default function AllWorldsAnimationProvider({
  children,
  state,
}: {
  children: React.ReactNode;
  state: "normal" | "tier" | "world";
}) {
  const [appearedTrophiesFields, setAppearedTrophiesFields] = useState(
    new Set<number>()
  );

  function addAppearedTrophiesField(trophies: number) {
    setAppearedTrophiesFields((prev) => new Set([...prev, trophies]));
  }

  const [innerState, setInnerState] = useState(state);

  function setState(stateArg: "normal" | "tier" | "world") {
    setInnerState(stateArg);
  }

  return (
    <AllWorldsAnimationContext.Provider
      value={{
        appearedTrophiesFields,
        addAppearedTrophiesField,
        state: innerState,
        setState
      }}
    >
      {children}
    </AllWorldsAnimationContext.Provider>
  );
}
