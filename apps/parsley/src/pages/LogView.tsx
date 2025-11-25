import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks/usePageVisibilityAnalytics";
import LogWindow from "components/LogWindow";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import LoadingPage from "./LogView/LoadingPage";

interface LogViewProps {
  logType: LogTypes;
}

const LogView: React.FC<LogViewProps> = ({ logType }) => {
  usePageVisibilityAnalytics({
    attributes: { logType },
    identifier: "LogView",
  });
  const { hasLogs } = useLogContext();
  return hasLogs === null ? <LoadingPage logType={logType} /> : <LogWindow />;
};

export default LogView;
