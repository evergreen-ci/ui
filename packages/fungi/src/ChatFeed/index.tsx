import { useChat } from "@ai-sdk/react";
import styled from "@emotion/styled";
import { ChatWindow } from "@lg-chat/chat-window";
import { InputBar } from "@lg-chat/input-bar";
import { LeafyGreenChatProvider } from "@lg-chat/leafygreen-chat-provider";
import { MessageFeed } from "@lg-chat/message-feed";
import { DefaultChatTransport } from "ai";
import { size } from "@evg-ui/lib/constants/tokens";
import { useChatContext } from "../Context";
import { Disclaimer } from "../Disclaimer";
import { MessageEvalProps } from "../MessageEvaluation";
import { FungiUIMessage, MessageRenderer } from "../MessageRenderer";
import { Suggestions } from "../Suggestions";

export type ChatFeedProps = {
  apiUrl: string;
  bodyData?: object;
  chatSuggestions?: string[];
  disclaimerContent?: React.ReactNode;
  handleRatingChange?: (id: string) => MessageEvalProps["handleVote"];
};

export const ChatFeed: React.FC<ChatFeedProps> = ({
  apiUrl,
  bodyData,
  chatSuggestions,
  disclaimerContent,
  handleRatingChange,
}) => {
  const { appName } = useChatContext();
  const { messages, sendMessage } = useChat<FungiUIMessage>({
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
            messages.map((m) => {
              const spanId = m?.metadata?.spanId;
              return (
                <MessageRenderer
                  key={m.id}
                  handleVote={spanId ? handleRatingChange?.(spanId) : undefined}
                  {...m}
                />
              );
            })
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
  gap: ${size.s};
  height: 100%;
  justify-content: space-between;
`;
