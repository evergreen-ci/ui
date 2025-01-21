import { useContext, createContext, useMemo, useState } from "react";

interface BuildVariantState {
  columnWidth: number;
  setColumnWidth: (c: number) => void;
}

const BuildVariantContext = createContext<BuildVariantState | null>(null);

interface BuildVariantProviderProps {
  children: React.ReactNode;
}

const BuildVariantProvider: React.FC<BuildVariantProviderProps> = ({
  children,
}) => {
  const [columnWidth, setColumnWidth] = useState(0);

  const buildVariantState = useMemo(
    () => ({
      columnWidth,
      setColumnWidth,
    }),
    [columnWidth],
  );

  return (
    <BuildVariantContext.Provider value={buildVariantState}>
      {children}
    </BuildVariantContext.Provider>
  );
};

const useBuildVariantContext = () => {
  const context = useContext(BuildVariantContext);
  if (context === undefined) {
    throw new Error(
      "useBuildVariantContext must be used within a BuildVariantProvider",
    );
  }
  return context as BuildVariantState;
};

export { BuildVariantProvider, useBuildVariantContext };
