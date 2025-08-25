import { Chatbot } from "components/Chatbot";
import LogWindow from "components/LogWindow";
import { LogTypes } from "constants/enums";
import { showAI } from "constants/featureFlags";
import { useLogContext } from "context/LogContext";
import LoadingPage from "./LogView/LoadingPage";

interface LogViewProps {
  logType: LogTypes;
}

const LogView: React.FC<LogViewProps> = ({ logType }) => {
  const { hasLogs } = useLogContext();
  if (hasLogs === null) {
    return <LoadingPage logType={logType} />;
  }
  if (showAI) {
    return (
      <Chatbot>
        <LogWindow />
      </Chatbot>
    );
  }
  return <LogWindow />;
};

export default LogView;
