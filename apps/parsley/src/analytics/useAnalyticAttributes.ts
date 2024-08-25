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
        openTelemetry.setGlobalAttribute("log.type", logType);
      }
      if (userId !== null) {
        openTelemetry.setGlobalAttribute("user.id", userId);
      }
      if (renderingType !== undefined) {
        openTelemetry.setGlobalAttribute("rendering.type", renderingType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, logType, renderingType]);
};
