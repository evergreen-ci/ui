import { useChat } from "@ai-sdk/react";
import { ChatWindow } from "@lg-chat/chat-window";
import { InputBar } from "@lg-chat/input-bar";
import {
  LeafyGreenChatProvider,
  LeafyGreenChatProviderProps,
} from "@lg-chat/leafygreen-chat-provider";
import { MessageFeed } from "@lg-chat/message-feed";
import { DefaultChatTransport } from "ai";
import ChatSuggestions from "./ChatSuggestions";
import RenderChatParts from "./RenderChatParts";

type Props = {
  apiUrl: string;
  bodyData?: object;
  chatSuggestions?: string[];
} & Pick<LeafyGreenChatProviderProps, "assistantName">;

export const ChatFeed: React.FC<Props> = ({
  apiUrl,
  assistantName,
  bodyData,
  chatSuggestions,
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
      <ChatWindow badgeText="Beta" title="">
        <MessageFeed>
          {messages.map(({ id, parts, role }) => (
            <RenderChatParts key={id} id={id} parts={parts} role={role} />
          ))}
        </MessageFeed>
        {messages.length === 0 && chatSuggestions && (
          <ChatSuggestions
            chatSuggestions={chatSuggestions}
            handleSend={handleSend}
          />
        )}
        <InputBar onMessageSend={handleSend} />
      </ChatWindow>
    </LeafyGreenChatProvider>
  );
};
