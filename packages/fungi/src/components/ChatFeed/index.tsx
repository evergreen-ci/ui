import { useChat } from "@ai-sdk/react";
import styled from "@emotion/styled";
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
  emptyState?: React.ReactNode;
} & Pick<LeafyGreenChatProviderProps, "assistantName">;

export const ChatFeed: React.FC<Props> = ({
  apiUrl,
  assistantName,
  bodyData,
  chatSuggestions,
  emptyState,
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

  const hasMessages = messages.length > 0;
  return (
    <Container>
      <LeafyGreenChatProvider assistantName={assistantName}>
        {/* This title won't be visible since we're using the compact variant */}
        {hasMessages && (
          <MessageFeed>
            {messages.map(({ id, parts, role }) => (
              <RenderChatParts key={id} id={id} parts={parts} role={role} />
            ))}
          </MessageFeed>
        )}
        {!hasMessages && (
          <>
            {emptyState}
            {chatSuggestions && (
              <ChatSuggestions
                chatSuggestions={chatSuggestions}
                handleSend={handleSend}
              />
            )}
          </>
        )}
        <StyledInputBar onMessageSend={handleSend} />
      </LeafyGreenChatProvider>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: red 1px solid;
`;

const StyledInputBar = styled(InputBar)`
  width: 100%;
  padding: 0;
`;
