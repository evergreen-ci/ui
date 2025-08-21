import { useChat } from "@ai-sdk/react";
import { ChatWindow } from "@lg-chat/chat-window";
import { InputBar } from "@lg-chat/input-bar";
import { Message } from "@lg-chat/message";
import { MessageFeed } from "@lg-chat/message-feed";
import { DefaultChatTransport } from "ai";

type ChatbotProps = {
  apiUrl: string;
};

export const Chatbot = ({ apiUrl }: React.PropsWithChildren<ChatbotProps>) => {
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: apiUrl,
      prepareSendMessagesRequest({ id, messages: outgoingMessages }) {
        return {
          body: { message: outgoingMessages[outgoingMessages.length - 1], id },
        };
      },
    }),
  });

  const handleSend = (message: string) => {
    sendMessage({ text: message });
  };

  return (
    <ChatWindow title="">
      {/* ChatWindow includes a ChatProvider */}
      <MessageFeed>
        {messages.map(({ id, parts, role }) => (
          <Message key={id} isSender={role === "user"}>
            {parts.map((part, index) =>
              part.type === "text" ? (
                <span key={index}>{part.text}</span>
              ) : null,
            )}
          </Message>
        ))}
      </MessageFeed>
      <InputBar onMessageSend={handleSend} />
    </ChatWindow>
  );
};
