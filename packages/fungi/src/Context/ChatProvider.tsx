import { createContext, useMemo, useState } from "react";

export type ChatContextState = {
  appName: string;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChatContext = createContext<ChatContextState | null>(null);

type ProviderProps = {
  appName: string;
  children: React.ReactNode;
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
    [drawerOpen, setDrawerOpen],
  );

  return (
    <ChatContext.Provider value={memoizedContext}>
      {children}
    </ChatContext.Provider>
  );
};
