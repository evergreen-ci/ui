import { createContext, useContext, useMemo, useState } from "react";

type ChatbotContextState = {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatbotContext = createContext<ChatbotContextState | null>(null);

export const useChatbotContext = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error(
      "useChatbotContext must be used within a ChatbotContextProvider",
    );
  }
  return context as ChatbotContextState;
};

type ProviderProps = {
  children: React.ReactNode;
};

export const ChatbotContextProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const memoizedContext = useMemo(
    () => ({
      drawerOpen,
      setDrawerOpen,
    }),
    [drawerOpen, setDrawerOpen],
  );

  return (
    <ChatbotContext.Provider value={memoizedContext}>
      {children}
    </ChatbotContext.Provider>
  );
};
