import { ChangeEvent, FormEvent, useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import Badge, { Variant as BadgeVariant } from "@leafygreen-ui/badge";
import { Chat, MessageRatingValue } from "@evg-ui/fungi/Chat";
import { ChatDrawer } from "@evg-ui/fungi/ChatDrawer";
import {
  ChatProvider as FungiProvider,
  useChatContext,
} from "@evg-ui/fungi/Context";
import { size } from "@evg-ui/lib/constants/tokens";
import { post } from "@evg-ui/lib/utils/request/post";
import { useAIAgentAnalytics } from "analytics";
import { aiPrompts } from "constants/aiPrompts";
import { useLogContext } from "context/LogContext";
import { parsleyAIURL } from "utils/environmentVariables";

const chatURL = `${parsleyAIURL}/completions/parsley/conversations/chat`;
const ratingURL = `${parsleyAIURL}/completions/parsley/conversations/rate`;
const loginURL = `${parsleyAIURL}/login`;

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <FungiProvider appName="Parsley AI">{children}</FungiProvider>;

const ChatbotContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { sendEvent } = useAIAgentAnalytics();
  const { logMetadata } = useLogContext();
  const { drawerOpen } = useChatContext();
  const { execution, fileName, groupID, logType, origin, taskID, testID } =
    logMetadata ?? {};

  const bodyData = {
    logMetadata: {
      execution: Number(execution),
      fileName: fileName,
      group_id: groupID,
      log_type: logType,
      origin,
      task_id: taskID,
      test_id: testID,
    },
  };

  const handleFeedback = useCallback(
    (spanId: string) =>
      async (
        _e: FormEvent<HTMLFormElement> | ChangeEvent<HTMLInputElement>,
        options?: { feedback?: string; rating: MessageRatingValue },
      ) => {
        // This should never happen but LG's handler is oddly typed
        if (!options) return;

        // Track when feedback is submitted (has feedback text) vs just rating
        if (options.feedback) {
          sendEvent({
            feedback: options.feedback,
            name: "Clicked submit feedback button",
            spanId,
          });
        }
        sendEvent({
          name: "Clicked submit rating button",
          rating: options.rating,
          spanId,
        });

        const handleError = (err: Error) => {
          // Re-throw error to invoke LG error state
          throw err;
        };
        await post(
          ratingURL,
          {
            // Clicking thumb icon will omit `feedback`, but otherwise rating and providing feedback do the same thing.
            feedback: options?.feedback,
            rating: options.rating === MessageRatingValue.Liked ? 1 : 0,
            spanId,
          },
          handleError,
        );
      },
    [sendEvent],
  );

  const handleCopy = useCallback(() => {
    sendEvent({ name: "Clicked copy response button" });
  }, [sendEvent]);

  useEffect(() => {
    sendEvent({
      name: "Toggled AI agent panel",
      open: drawerOpen,
    });
  }, [drawerOpen, sendEvent]);

  return (
    <ChatDrawer
      chatContent={
        <Chat
          apiUrl={chatURL}
          bodyData={bodyData}
          chatSuggestions={aiPrompts}
          handleRatingChange={handleFeedback}
          handleSubmitFeedback={handleFeedback}
          loginUrl={loginURL}
          onClickCopy={handleCopy}
          onClickSuggestion={(suggestion) => {
            sendEvent({ name: "Clicked suggestion", suggestion });
          }}
          onSendMessage={(message) => {
            sendEvent({ message, name: "Interacted with Parsley AI" });
          }}
        />
      }
      data-cy="chat-drawer"
      // TODO: `drawerTitle` can be removed after beta period for Parsley AI ends.
      drawerTitle={
        <DrawerTitle>
          Parsley AI <Badge variant={BadgeVariant.Blue}>Beta</Badge>
        </DrawerTitle>
      }
    >
      {children}
    </ChatDrawer>
  );
};

export const Chatbot: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ChatProvider>
    <ChatbotContent>{children}</ChatbotContent>
  </ChatProvider>
);

const DrawerTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
`;
