import styled from "@emotion/styled";
import { ChatDrawer } from "@evg-ui/fungi/components/ChatDrawer";
import { ChatFeed } from "@evg-ui/fungi/components/ChatFeed";
import { ChatProvider } from "@evg-ui/fungi/Context";
import aiPrompts from "constants/aiPrompts";
import { navbarHeight, subheaderHeight } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { parsleyChatURL, parsleyLoginURL } from "utils/environmentVariables";
import TermsOfUseDisclaimer from "./TermsOfUseDisclaimer";

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
      <StyledChatDrawer
        chatContent={
          <ChatFeed
            apiUrl={parsleyChatURL}
            appName="Parsley AI"
            bodyData={bodyData}
            chatSuggestions={aiPrompts}
            emptyState={<TermsOfUseDisclaimer />}
            loginUrl={parsleyLoginURL}
          />
        }
        title="Parsley AI"
      >
        {children}
      </StyledChatDrawer>
    </ChatProvider>
  );
};

const StyledChatDrawer = styled(ChatDrawer)`
  height: calc(100% - (${navbarHeight} + ${subheaderHeight}));
`;
