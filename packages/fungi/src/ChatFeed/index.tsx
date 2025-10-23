import { UIMessage, useChat, UseChatHelpers } from "@ai-sdk/react";
import styled from "@emotion/styled";
import { ChatWindow } from "@lg-chat/chat-window";
import { InputBar, InputBarProps, State } from "@lg-chat/input-bar";
import { LeafyGreenChatProvider } from "@lg-chat/leafygreen-chat-provider";
import { MessageActionsProps } from "@lg-chat/message";
import { MessageFeed } from "@lg-chat/message-feed";
import { DefaultChatTransport } from "ai";
import { size } from "@evg-ui/lib/constants/tokens";
import { useChatContext } from "../Context";
import { Disclaimer } from "../Disclaimer";
import { FungiUIMessage, MessageRenderer } from "../MessageRenderer";
import { Suggestions } from "../Suggestions";

export type ChatFeedProps = {
  apiUrl: string;
  bodyData?: object;
  chatSuggestions?: string[];
  disclaimerContent?: React.ReactNode;
  handleSubmitFeedback?: (
    spanId: string,
  ) => MessageActionsProps["onSubmitFeedback"];
  handleRatingChange?: (
    spanId: string,
  ) => MessageActionsProps["onRatingChange"];
  onClickCopy?: MessageActionsProps["onClickCopy"];
  onClickSuggestion?: (suggestion: string) => void;
  onSendMessage?: (message: string) => void;
};

export const ChatFeed: React.FC<ChatFeedProps> = ({
  apiUrl,
  bodyData,
  chatSuggestions,
  disclaimerContent,
  handleRatingChange,
  handleSubmitFeedback,
  onClickCopy,
  onClickSuggestion,
  onSendMessage,
}) => {
  const { appName } = useChatContext();
  const { error, messages, sendMessage, status } = useChat<FungiUIMessage>({
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
    onSendMessage?.(message);
    sendMessage({ text: message });
  };

  const inputState = getInputState({ error, status });
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
                  handleSend={(s: string) => {
                    handleSend(s);
                    onClickSuggestion?.(s);
                  }}
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
                  onClickCopy={onClickCopy}
                  onRatingChange={
                    spanId ? handleRatingChange?.(spanId) : undefined
                  }
                  onSubmitFeedback={
                    spanId ? handleSubmitFeedback?.(spanId) : undefined
                  }
                  {...m}
                />
              );
            })
          )}
        </MessageFeed>
        <InputBar {...inputState} onMessageSend={handleSend} />
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

const getInputState = ({
  error,
  status,
}: Pick<UseChatHelpers<UIMessage>, "error" | "status">): Pick<
  InputBarProps,
  "disableSend" | "errorMessage" | "state"
> => {
  if (error) {
    return {
      disableSend: false,
      errorMessage: error.toString(),
      state: State.Error,
    };
  } else if (status === "streaming" || status === "submitted") {
    return {
      disableSend: true,
      errorMessage: undefined,
      state: State.Loading,
    };
  }
  return {
    disableSend: false,
    errorMessage: undefined,
    state: State.Unset,
  };
};
