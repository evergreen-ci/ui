import { useCallback } from "react";
import styled from "@emotion/styled";
import Badge, { Variant as BadgeVariant } from "@leafygreen-ui/badge";
import { Chat, ChatProps, MessageRatingValue } from "@evg-ui/fungi/Chat";
import { ChatDrawer } from "@evg-ui/fungi/ChatDrawer";
import { ChatProvider as FungiProvider } from "@evg-ui/fungi/Context";
import { size } from "@evg-ui/lib/constants/tokens";
import { reportError } from "@evg-ui/lib/utils/errorReporting";
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

export const Chatbot: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { sendEvent } = useAIAgentAnalytics();
  const { logMetadata } = useLogContext();
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

  const handleRatingChange = useCallback(
    ((spanId) => async (e, options) => {
      // This should never happen but the handler is oddly typed
      if (!options) return;
      try {
        const response = await fetch(ratingURL, {
          body: JSON.stringify({
            rating: options.rating === MessageRatingValue.Liked ? 1 : 0,
            spanId,
          }),
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(`Rating message: ${err.message}`);
        }
      } catch (error: any) {
        reportError(new Error(error)).warning();
      }
    }) satisfies ChatProps["handleRatingChange"],
    [ratingURL],
  );

  const handleSubmitFeedback = useCallback(
    ((spanId) => async (e, options) => {
      // This should never happen but the handler is oddly typed
      if (!options) return;
      try {
        const response = await fetch(ratingURL, {
          body: JSON.stringify({
            feedback: options.feedback,
            rating: options.rating === MessageRatingValue.Liked ? 1 : 0,
            spanId,
          }),
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(`Sending message feedback: ${err.message}`);
        }
      } catch (error: any) {
        reportError(new Error(error)).warning();
      }
    }) satisfies ChatProps["handleSubmitFeedback"],
    [ratingURL],
  );

  return (
    <ChatDrawer
      chatContent={
        <Chat
          apiUrl={chatURL}
          bodyData={bodyData}
          chatSuggestions={aiPrompts}
          disclaimerContent="Generative AI models may produce incorrect or misleading
              information. Please review the output carefully. Parsley AI is
              meant to assist with investigations and not to replace your own
              judgement."
          handleRatingChange={handleRatingChange}
          handleSubmitFeedback={handleSubmitFeedback}
          loginUrl={loginURL}
          onClickSuggestion={(suggestion) => {
            sendEvent({ name: "Clicked suggestion", suggestion });
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

const DrawerTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
`;
