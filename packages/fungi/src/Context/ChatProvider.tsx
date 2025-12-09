import { useCallback, useMemo, useState } from "react";
import { ChatContext, Chip } from "./context";

type ProviderProps = {
  appName: string;
  children?: React.ReactNode;
};

export const ChatProvider: React.FC<ProviderProps> = ({
  appName,
  children,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chips, setChips] = useState<Map<string, Chip>>(new Map());

  const chipsArray = useMemo(() => Array.from(chips.values()), [chips]);

  const toggleChip = useCallback((chip: Chip) => {
    const mapKey = chip.identifier;
    setChips((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(mapKey)) {
        newMap.delete(mapKey);
      } else {
        newMap.set(mapKey, chip);
      }
      return newMap;
    });
  }, []);

  const clearChips = useCallback(() => {
    setChips(new Map());
  }, []);

  const memoizedContext = useMemo(
    () => ({
      appName,
      drawerOpen,
      setDrawerOpen,
      chips: chipsArray,
      toggleChip,
      clearChips,
    }),
    [appName, drawerOpen, setDrawerOpen, chipsArray, toggleChip, clearChips],
  );

  return (
    <ChatContext.Provider value={memoizedContext}>
      {children}
    </ChatContext.Provider>
  );
};
