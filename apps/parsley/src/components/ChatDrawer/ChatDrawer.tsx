import { Drawer, DrawerLayout } from "@leafygreen-ui/drawer";
import { Chatbot } from "@evg-ui/fungi/components/Chatbot";
import { useLogContext } from "context/LogContext";
import { parsleyChatURL } from "utils/environmentVariables";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const ChatDrawer = ({
  children,
  open,
  setOpen,
}: React.PropsWithChildren<Props>) => {
  console.log(open, parsleyChatURL);

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
        <Drawer title="Parsley AI">
          <Chatbot apiUrl={parsleyChatURL} bodyData={bodyData} />
        </Drawer>
      }
      isDrawerOpen={open}
      onClose={() => setOpen(false)}
    >
      {children}
    </DrawerLayout>
  );
};
