import { useChat } from "@ai-sdk/react";
import { ChatWindow } from "@lg-chat/chat-window";
import { InputBar } from "@lg-chat/input-bar";
import { LeafyGreenChatProvider } from "@lg-chat/leafygreen-chat-provider";
import { Message } from "@lg-chat/message";
import { MessageFeed } from "@lg-chat/message-feed";
import { DefaultChatTransport } from "ai";
import { useChatContext } from "../Context";

type Props = {
  apiUrl: string;
  bodyData?: object;
};

export const ChatFeed: React.FC<Props> = ({ apiUrl, bodyData }) => {
  const { appName } = useChatContext();
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: apiUrl,
      credentials: "include",
      prepareSendMessagesRequest({ id, messages: outgoingMessages }) {
        return {
          body: {
            ...(bodyData ?? {}),
            message: outgoingMessages[outgoingMessages.length - 1],
            id,
          },
        };
      },
    }),
  });

  const handleSend = (message: string) => {
    sendMessage({ text: message });
  };

  return (
    <LeafyGreenChatProvider assistantName={appName}>
      <ChatWindow>
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
    </LeafyGreenChatProvider>
  );
};
