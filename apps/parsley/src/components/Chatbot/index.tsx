import { Chat } from "@evg-ui/fungi/Chat";
import { ChatDrawer } from "@evg-ui/fungi/ChatDrawer";
import { ChatProvider as FungiProvider } from "@evg-ui/fungi/Context";
import { aiPrompts } from "constants/aiPrompts";
import { useLogContext } from "context/LogContext";
import {
  parsleyChatLoginURL,
  parsleyChatURL,
} from "utils/environmentVariables";

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <FungiProvider appName="Parsley AI">{children}</FungiProvider>;

export const Chatbot: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { logMetadata } = useLogContext();
  const { execution, logType, origin, taskID, testID } = logMetadata ?? {};

  const bodyData = {
    logMetadata: {
      execution: Number(execution),
      log_type: logType,
      origin,
      task_id: taskID,
      test_id: testID,
    },
  };

  return (
    <ChatDrawer
      chatContent={
        <Chat
          apiUrl={parsleyChatURL}
          bodyData={bodyData}
          chatSuggestions={aiPrompts}
          disclaimerContent={
            <>
              Generative AI models may produce incorrect or misleading
              information. Please review the output carefully. Parsley AI is
              meant to assist with investigations and not to replace your own
              judgement.
            </>
          }
          loginUrl={parsleyChatLoginURL}
        />
      }
    >
      {children}
    </ChatDrawer>
  );
};
