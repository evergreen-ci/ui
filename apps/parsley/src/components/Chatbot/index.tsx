import styled from "@emotion/styled";
import Badge, { Variant as BadgeVariant } from "@leafygreen-ui/badge";
import { Chat } from "@evg-ui/fungi/Chat";
import { ChatDrawer } from "@evg-ui/fungi/ChatDrawer";
import { ChatProvider as FungiProvider } from "@evg-ui/fungi/Context";
import { size } from "@evg-ui/lib/constants/tokens";
import { useAIAgentAnalytics } from "analytics";
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

  return (
    <ChatDrawer
      chatContent={
        <Chat
          apiUrl={parsleyChatURL}
          bodyData={bodyData}
          chatSuggestions={aiPrompts}
          disclaimerContent="Generative AI models may produce incorrect or misleading
              information. Please review the output carefully. Parsley AI is
              meant to assist with investigations and not to replace your own
              judgement."
          loginUrl={parsleyChatLoginURL}
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
