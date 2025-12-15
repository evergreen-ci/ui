import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks/usePageVisibilityAnalytics";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import LogWindow from "components/LogWindow";
import { useLogContext } from "context/LogContext";
import FileDropper from "./LogDrop/FileDropper";

const LogDrop = () => {
  usePageVisibilityAnalytics();
  const { hasLogs, logMetadata } = useLogContext();
  usePageTitle(`${hasLogs ? logMetadata?.fileName : "Upload logs"} | Parsley`);
  return hasLogs ? <LogWindow /> : <FileDropper />;
};

export default LogDrop;
