import { useCallback, useMemo, useState } from "react";
import { ChatContext, SelectedLineRange } from "./context";

type ProviderProps = {
  appName: string;
  children?: React.ReactNode;
};

export const ChatProvider: React.FC<ProviderProps> = ({
  appName,
  children,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedLineRanges, setSelectedLineRanges] = useState<
    Map<string, SelectedLineRange>
  >(new Map());

  const toggleSelectedLineRange = useCallback((range: SelectedLineRange) => {
    setDrawerOpen(true);
    const mapKey = range.endLine
      ? `${range.startLine}-${range.endLine}`
      : `${range.startLine}`;
    setSelectedLineRanges((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(mapKey)) {
        newMap.delete(mapKey);
      } else {
        newMap.set(mapKey, range);
      }
      return newMap;
    });
  }, []);

  const clearSelectedLineRanges = useCallback(() => {
    setSelectedLineRanges(new Map());
  }, []);

  const memoizedContext = useMemo(
    () => ({
      appName,
      drawerOpen,
      setDrawerOpen,
      selectedLineRanges,
      toggleSelectedLineRange,
      clearSelectedLineRanges,
    }),
    [
      appName,
      drawerOpen,
      setDrawerOpen,
      selectedLineRanges,
      toggleSelectedLineRange,
      clearSelectedLineRanges,
    ],
  );

  return (
    <ChatContext.Provider value={memoizedContext}>
      {children}
    </ChatContext.Provider>
  );
};
