import { Chat, ChatProps, MessageRatingValue } from "@evg-ui/fungi/Chat";
import { ChatDrawer } from "@evg-ui/fungi/ChatDrawer";
import { ChatProvider as FungiProvider } from "@evg-ui/fungi/Context";
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

  const handleRatingChange = ((spanId: string) => async (e, options) => {
    const response = await fetch(ratingURL, {
      body: JSON.stringify({
        rating: options?.rating === MessageRatingValue.Liked ? 1 : 0,
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
  }) satisfies ChatProps["handleRatingChange"];

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
          loginUrl={loginURL}
        />
      }
      data-cy="chat-drawer"
    >
      {children}
    </ChatDrawer>
  );
};
