import { useEffect } from "react";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import LogWindow from "components/LogWindow";
import { NavigationWarningModal } from "components/NavigationWarningModal";
import { useLogContext } from "context/LogContext";
import FileDropper from "./LogDrop/FileDropper";

const LogDrop = () => {
  const { hasLogs, isUploadedLog, logMetadata } = useLogContext();
  usePageTitle(`${hasLogs ? logMetadata?.fileName : "Upload logs"} | Parsley`);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUploadedLog) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isUploadedLog]);

  return (
    <>
      <NavigationWarningModal shouldBlock={isUploadedLog} />
      {hasLogs ? <LogWindow /> : <FileDropper />}
    </>
  );
};

export default LogDrop;
