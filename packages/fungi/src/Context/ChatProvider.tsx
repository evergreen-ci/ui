import { useCallback, useMemo, useState } from "react";
import { ChatContext, ContextChip } from "./context";

export type ChatProviderProps = {
  appName: string;
  children?: React.ReactNode;
  initialChips?: Map<string, ContextChip>;
};

export const ChatProvider: React.FC<ChatProviderProps> = ({
  appName,
  children,
  initialChips,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chips, setChips] = useState<Map<string, ContextChip>>(
    initialChips ?? new Map(),
  );

  const chipsArray = useMemo(() => Array.from(chips.values()), [chips]);

  const toggleChip = useCallback((chip: ContextChip) => {
    setDrawerOpen(true);
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

  const [messageToChipMap, setMessageToChipMap] = useState<
    Map<string, ContextChip[]>
  >(new Map());

  const setChipsForMessage = useCallback(
    (messageId: string, messageChips: ContextChip[]) => {
      setMessageToChipMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(messageId, messageChips);
        return newMap;
      });
    },
    [],
  );

  const getChipsForMessage = useCallback(
    (messageId: string): ContextChip[] => messageToChipMap.get(messageId) ?? [],
    [messageToChipMap],
  );

  const memoizedContext = useMemo(
    () => ({
      appName,
      drawerOpen,
      setDrawerOpen,
      chips: chipsArray,
      toggleChip,
      clearChips,
      setChipsForMessage,
      getChipsForMessage,
    }),
    [
      appName,
      drawerOpen,
      setDrawerOpen,
      chipsArray,
      toggleChip,
      clearChips,
      setChipsForMessage,
      getChipsForMessage,
    ],
  );

  return (
    <ChatContext.Provider value={memoizedContext}>
      {children}
    </ChatContext.Provider>
  );
};
