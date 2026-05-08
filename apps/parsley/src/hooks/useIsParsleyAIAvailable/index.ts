import { useLogContext } from "context/LogContext";

/**
 * `useIsParsleyAIAvailable` checks if Parsley AI is available for the current log.
 * Parsley AI is only available for non-uploaded logs (logs from Evergreen tasks).
 * @returns true if Parsley AI is available and can be toggled
 */
const useIsParsleyAIAvailable = (): boolean => {
  const { isUploadedLog } = useLogContext();
  return !isUploadedLog;
};

export { useIsParsleyAIAvailable };
