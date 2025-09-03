import { useChat } from "@ai-sdk/react";
import styled from "@emotion/styled";
import { ChatWindow } from "@lg-chat/chat-window";
import { InputBar } from "@lg-chat/input-bar";
import { LeafyGreenChatProvider } from "@lg-chat/leafygreen-chat-provider";
import { Message } from "@lg-chat/message";
import { MessageFeed } from "@lg-chat/message-feed";
import { DefaultChatTransport } from "ai";
import { useChatContext } from "../Context";
import { Disclaimer } from "../Disclaimer";
import { Suggestions } from "../Suggestions";

export type ChatFeedProps = {
  apiUrl: string;
  bodyData?: object;
  chatSuggestions?: string[];
  disclaimerContent?: React.ReactNode;
};

export const ChatFeed: React.FC<ChatFeedProps> = ({
  apiUrl,
  bodyData,
  chatSuggestions,
  disclaimerContent,
}) => {
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

  const hasMessages = messages?.length > 0;

  return (
    <LeafyGreenChatProvider assistantName={appName}>
      <StyledChatWindow>
        <MessageFeed>
          {!hasMessages ? (
            <EmptyContainer>
              <div />
              {disclaimerContent && (
                <Disclaimer>{disclaimerContent}</Disclaimer>
              )}
              {chatSuggestions && (
                <Suggestions
                  handleSend={handleSend}
                  suggestions={chatSuggestions}
                />
              )}
            </EmptyContainer>
          ) : (
            messages.map(({ id, parts, role }) => (
              <Message key={id} isSender={role === "user"}>
                {parts.map((part, index) =>
                  part.type === "text" ? (
                    <span key={index}>{part.text}</span>
                  ) : null,
                )}
              </Message>
            ))
          )}
        </MessageFeed>
        <InputBar onMessageSend={handleSend} />
      </StyledChatWindow>
    </LeafyGreenChatProvider>
  );
};

// Override fixed height of ChatWindow
const StyledChatWindow = styled(ChatWindow)`
  height: 100%;
  > div {
    height: 100%;
    > div:nth-of-type(1) {
      height: 100%;
    }
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;
