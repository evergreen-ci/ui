import { createContext, useMemo, useState } from "react";

export type ChatContextState = {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChatContext = createContext<ChatContextState | null>(null);

type ProviderProps = {
  children: React.ReactNode;
};

export const ChatProvider: React.FC<ProviderProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const memoizedContext = useMemo(
    () => ({
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
