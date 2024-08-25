import { useEffect } from "react";
import { useLogContext } from "context/LogContext";

export const useAnalyticAttributes = () => {
  const { logMetadata } = useLogContext();
  const { logType, renderingType } = logMetadata || {};
  const { openTelemetry } = window;

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // TODO: Replace this with honeycomb equivalent
    if (openTelemetry) {
      if (logType !== undefined) {
        openTelemetry.setGlobalAttribute("logType", logType);
      }
      if (userId !== null) {
        openTelemetry.setGlobalAttribute("userId", userId);
      }
      if (renderingType !== undefined) {
        openTelemetry.setGlobalAttribute("renderingType", renderingType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, logType, renderingType]);
};
