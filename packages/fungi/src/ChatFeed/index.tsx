import { UIMessage, useChat, UseChatHelpers } from "@ai-sdk/react";
import { ChatWindow } from "@lg-chat/chat-window";
import { InputBar, InputBarProps, State } from "@lg-chat/input-bar";
import { LeafyGreenChatProvider } from "@lg-chat/leafygreen-chat-provider";
import { MessageActionsProps } from "@lg-chat/message";
import { MessageFeed } from "@lg-chat/message-feed";
import { DefaultChatTransport } from "ai";
import { useChatContext } from "../Context";
import { FungiUIMessage, MessageRenderer } from "../MessageRenderer";
import { Suggestions } from "../Suggestions";

export type ChatFeedProps = {
  apiUrl: string;
  bodyData?: object;
  chatSuggestions?: string[];
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
      <ChatWindow>
        <MessageFeed>
          {!hasMessages && chatSuggestions ? (
            <Suggestions
              handleSend={(s: string) => {
                handleSend(s);
                onClickSuggestion?.(s);
              }}
              suggestions={chatSuggestions}
            />
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
      </ChatWindow>
    </LeafyGreenChatProvider>
  );
};

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
