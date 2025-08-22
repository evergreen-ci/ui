import { ChatbotContextProvider } from "./Context";
import { ChatDrawer } from "./Drawer";

interface Props {
  children: React.ReactNode;
}

export const Chatbot: React.FC<Props> = ({ children }) => (
  <ChatbotContextProvider>
    <ChatDrawer>{children}</ChatDrawer>
  </ChatbotContextProvider>
);
