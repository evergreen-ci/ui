import { useMemo, useState } from "react";
import { ChatContext } from "./context";

type ProviderProps = {
  appName: string;
  children?: React.ReactNode;
};

export const ChatProvider: React.FC<ProviderProps> = ({
  appName,
  children,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const memoizedContext = useMemo(
    () => ({
      appName,
      drawerOpen,
      setDrawerOpen,
    }),
    [appName, drawerOpen, setDrawerOpen],
  );

  return (
    <ChatContext.Provider value={memoizedContext}>
      {children}
    </ChatContext.Provider>
  );
};
