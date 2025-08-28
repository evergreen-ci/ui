import { ChatDrawer } from "@evg-ui/fungi/ChatDrawer";
import { ChatFeed } from "@evg-ui/fungi/ChatFeed";
import { ChatProvider } from "@evg-ui/fungi/Context";
import { useLogContext } from "context/LogContext";
import { parsleyChatURL } from "utils/environmentVariables";

interface Props {
  children: React.ReactNode;
}

export const Chatbot: React.FC<Props> = ({ children }) => {
  const { logMetadata } = useLogContext();
  const { execution, logType, origin, taskID } = logMetadata ?? {};

  const bodyData = {
    logMetadata: {
      execution: Number(execution),
      log_type: logType,
      origin,
      task_id: taskID,
    },
  };

  return (
    <ChatProvider>
      <ChatDrawer
        chatContent={<ChatFeed apiUrl={parsleyChatURL} bodyData={bodyData} />}
        title="Parsley AI"
      >
        {children}
      </ChatDrawer>
    </ChatProvider>
  );
};
