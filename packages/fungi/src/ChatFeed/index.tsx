import { useChat } from "@ai-sdk/react";
import { ChatWindow } from "@lg-chat/chat-window";
import { InputBar } from "@lg-chat/input-bar";
import {
  LeafyGreenChatProvider,
  LeafyGreenChatProviderProps,
} from "@lg-chat/leafygreen-chat-provider";
import { Message } from "@lg-chat/message";
import { MessageFeed } from "@lg-chat/message-feed";
import { DefaultChatTransport } from "ai";

type Props = {
  apiUrl: string;
  bodyData?: object;
} & Pick<LeafyGreenChatProviderProps, "assistantName">;

export const ChatFeed: React.FC<Props> = ({
  apiUrl,
  assistantName,
  bodyData,
}) => {
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
    <LeafyGreenChatProvider assistantName={assistantName}>
      {/* This title won't be visible since we're using the compact variant */}
      <ChatWindow title="">
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
