import { usePageTitle } from "@evg-ui/lib/hooks";
import LogWindow from "components/LogWindow";
import { useLogContext } from "context/LogContext";
import FileDropper from "./LogDrop/FileDropper";

const LogDrop = () => {
  const { hasLogs, logMetadata } = useLogContext();
  usePageTitle(`${hasLogs ? logMetadata?.fileName : "Upload logs"} | Parsley`);
  return hasLogs ? <LogWindow /> : <FileDropper />;
};

export default LogDrop;
