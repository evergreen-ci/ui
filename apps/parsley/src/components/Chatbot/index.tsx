import { useLogContext } from "context/LogContext";
import {
  parsleyChatLoginURL,
  parsleyChatURL,
} from "utils/environmentVariables";
import { Chat } from "@evg-ui/fungi/Chat";
import { ChatDrawer } from "@evg-ui/fungi/ChatDrawer";
import { ChatProvider as FungiProvider } from "@evg-ui/fungi/Context";

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

  return (
    <ChatDrawer
      chatContent={
        <Chat
          apiUrl={parsleyChatURL}
          bodyData={bodyData}
          loginUrl={parsleyChatLoginURL}
        />
      }
      data-cy="chat-drawer"
    >
      {children}
    </ChatDrawer>
  );
};
