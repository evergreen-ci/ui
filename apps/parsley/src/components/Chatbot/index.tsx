import { Chat } from "@evg-ui/fungi/Chat";
import { ChatDrawer } from "@evg-ui/fungi/ChatDrawer";
import { ChatProvider } from "@evg-ui/fungi/Context";
import { useLogContext } from "context/LogContext";
import {
  parsleyChatLoginURL,
  parsleyChatURL,
} from "utils/environmentVariables";

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
    <ChatProvider appName="Parsley AI">
      <ChatDrawer
        chatContent={
          <Chat
            apiUrl={parsleyChatURL}
            bodyData={bodyData}
            loginUrl={parsleyChatLoginURL}
          />
        }
      >
        {children}
      </ChatDrawer>
    </ChatProvider>
  );
};
