import { ChatDrawer } from "@evg-ui/fungi/ChatDrawer";
import { ChatFeed } from "@evg-ui/fungi/ChatFeed";
import { ChatProvider } from "@evg-ui/fungi/Context";
import aiPrompts from "constants/aiPrompts";
import { useLogContext } from "context/LogContext";
import { parsleyChatURL } from "utils/environmentVariables";

interface Props {
  children: React.ReactNode;
}

export const Chatbot: React.FC<Props> = ({ children }) => {
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
    <ChatProvider>
      <ChatDrawer
        chatContent={
          <ChatFeed
            apiUrl={parsleyChatURL}
            bodyData={bodyData}
            chatSuggestions={aiPrompts}
          />
        }
        title="Parsley AI"
      >
        {children}
      </ChatDrawer>
    </ChatProvider>
  );
};
