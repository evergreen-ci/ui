import styled from "@emotion/styled";
import { Drawer, DrawerLayout } from "@leafygreen-ui/drawer";
import { Chatbot } from "@evg-ui/fungi/components/Chatbot";
import { useLogContext } from "context/LogContext";
import { parsleyChatURL } from "utils/environmentVariables";
import { useChatbotContext } from "./Context";

type Props = {
  children: React.ReactNode;
};

export const ChatDrawer: React.FC<Props> = ({ children }) => {
  const { drawerOpen, setDrawerOpen } = useChatbotContext();
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
    <DrawerLayout
      displayMode="embedded"
      drawer={
        <StyledDrawer title="Parsley AI">
          <Chatbot apiUrl={parsleyChatURL} bodyData={bodyData} />
        </StyledDrawer>
      }
      isDrawerOpen={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      {children}
    </DrawerLayout>
  );
};

const StyledDrawer = styled(Drawer)`
  > div {
    padding: 0;
  }
`;
