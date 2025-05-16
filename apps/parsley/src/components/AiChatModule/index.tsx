import { FixedChatWindow } from "@lg-chat/fixed-chat-window";
import { InputBar } from "@lg-chat/input-bar";
import { LeafyGreenChatProvider } from "@lg-chat/leafygreen-chat-provider";
import { MessageFeed } from "@lg-chat/message-feed";
import { useAiChat } from "context/AiChatProviderContext";
import ChatModuleMessage from "./ChatModuleMessage";
import ChatModuleMessageLoading from "./ChatModuleMessage/ChatModuleMessageLoading";

const AIChatModule = ({ ...props }) => {
  const { loading, messages, sendMessage } = useAiChat();
  const handleMessageSend = (messageBody: string) => {
    sendMessage(messageBody);
  };
  return (
    <LeafyGreenChatProvider>
      <FixedChatWindow
        badgeText="Skunk"
        title="Parsley AI"
        triggerText="Parsley AI"
        {...props}
      >
        <MessageFeed>
          {messages.map(({ content, links, role }) => (
            <ChatModuleMessage
              key={content}
              content={content}
              links={links}
              role={role}
            />
          ))}
          {loading && <ChatModuleMessageLoading />}
        </MessageFeed>
        <InputBar disabled={loading} onMessageSend={handleMessageSend} />
      </FixedChatWindow>
    </LeafyGreenChatProvider>
  );
};

export default AIChatModule;
