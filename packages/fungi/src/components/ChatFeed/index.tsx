import { useCallback, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import styled from "@emotion/styled";
import { InputBar } from "@lg-chat/input-bar";
import { MessageFeed } from "@lg-chat/message-feed";
import { DefaultChatTransport } from "ai";
import { size } from "@evg-ui/lib/constants/tokens";
import Login from "../Login";
import ChatSuggestions from "./ChatSuggestions";
import RenderChatParts from "./RenderChatParts";

type Props = {
  apiUrl: string;
  bodyData?: object;
  chatSuggestions?: string[];
  emptyState?: React.ReactNode;
  appName: string;
  loginUrl: string;
};

export const ChatFeed: React.FC<Props> = ({
  apiUrl,
  appName,
  bodyData,
  chatSuggestions,
  emptyState,
  loginUrl,
}) => {
  const [isSageAuthenticated, setIsSageAuthenticated] = useState(true);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const beginPollingIsSageAuthenticated = () => {
    const newIntervalId = setInterval(checkIsSageAuthenticated, 10000);
    setIntervalId(newIntervalId);
  };

  const checkIsSageAuthenticated = useCallback(async () => {
    try {
      const response = await fetch(loginUrl, { credentials: "include" });
      if (response.ok) {
        setIsSageAuthenticated(true);
        // Clear interval when authenticated
        if (intervalId) {
          clearInterval(intervalId);
          setIntervalId(null);
        }
      } else {
        setIsSageAuthenticated(false);
      }
    } catch (error) {
      setIsSageAuthenticated(false);
    }
  }, [loginUrl, intervalId]);

  // Initial check for authentication
  useEffect(() => {
    checkIsSageAuthenticated();
  }, [checkIsSageAuthenticated]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    },
    [intervalId],
  );

  const { error, messages, sendMessage } = useChat({
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
  if (!isSageAuthenticated) {
    return (
      <Login
        appName={appName}
        disabled={intervalId !== null}
        loginUrl={loginUrl}
        onLogin={beginPollingIsSageAuthenticated}
      />
    );
  }
  return (
    <Container>
      <>
        <ContentArea>
          {hasMessages ? (
            <MessageFeed>
              {messages.map(({ id, parts, role }) => (
                <RenderChatParts key={id} id={id} parts={parts} role={role} />
              ))}
            </MessageFeed>
          ) : (
            emptyState && <EmptyStateWrapper>{emptyState}</EmptyStateWrapper>
          )}
        </ContentArea>
        {!hasMessages && chatSuggestions && (
          <StyledChatSuggestions
            chatSuggestions={chatSuggestions}
            handleSend={handleSend}
          />
        )}
        <StyledInputBar
          errorMessage={error?.message ?? ""}
          onMessageSend={handleSend}
          state={error ? "error" : undefined}
        />
      </>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  overflow-y: auto;
`;

const EmptyStateWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledChatSuggestions = styled(ChatSuggestions)`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: ${size.xs};
`;

const StyledInputBar = styled(InputBar)`
  width: 100%;
  padding: 0;
`;
