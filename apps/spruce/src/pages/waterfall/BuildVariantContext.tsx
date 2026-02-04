import {
  useCallback,
  useContext,
  createContext,
  useMemo,
  useState,
} from "react";

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
  // We need to know columnWidth so that we can calculate the number of task boxes
  // that will fit in one row. This will allow us to make an accurate estimation
  // of the height.
  const [columnWidth, setColumnWidth] = useState(0);

  const setColumnWidthStable = useCallback((width: number) => {
    setColumnWidth((prev) => {
      if (prev === width) return prev;
      return width;
    });
  }, []);

  const buildVariantState = useMemo(
    () => ({
      columnWidth,
      setColumnWidth: setColumnWidthStable,
    }),
    [columnWidth, setColumnWidthStable],
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
