import { useContext } from "react";
import { ChatContext, ChatContextState } from "./ChatProvider";

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatContextProvider");
  }
  return context as ChatContextState;
};
