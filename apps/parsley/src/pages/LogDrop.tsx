import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import LogWindow from "components/LogWindow";
import { useLogContext } from "context/LogContext";
import FileDropper from "./LogDrop/FileDropper";

const LogDrop = () => {
  const { hasLogs, logMetadata } = useLogContext();
  usePageTitle(`Parsley | ${hasLogs ? logMetadata?.fileName : "Upload logs"}`);
  return hasLogs ? <LogWindow /> : <FileDropper />;
};

export default LogDrop;
