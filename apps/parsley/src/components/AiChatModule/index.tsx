import { FixedChatWindow } from "@lg-chat/fixed-chat-window";
import { InputBar } from "@lg-chat/input-bar";
import { LeafyGreenChatProvider } from "@lg-chat/leafygreen-chat-provider";
import { Message } from "@lg-chat/message";
import { MessageFeed } from "@lg-chat/message-feed";
import { useAiChat } from "context/AiChatProviderContext";

const AIChatModule = ({ ...props }) => {
  const { messages, sendMessage } = useAiChat();
  const handleMessageSend = (messageBody: string) => {
    sendMessage(messageBody);
  };
  return (
    <LeafyGreenChatProvider>
      <FixedChatWindow title="Parsley AI" triggerText="Parsley AI" {...props}>
        <MessageFeed>
          {messages.map(({ content, role }) => (
            <Message
              key={content}
              isSender={role === "user"}
              messageBody={content}
            />
          ))}
        </MessageFeed>
        <InputBar onMessageSend={handleMessageSend} />
      </FixedChatWindow>
    </LeafyGreenChatProvider>
  );
};

export default AIChatModule;
