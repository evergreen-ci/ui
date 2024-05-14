import { useEffect } from "react";
import { useLogContext } from "context/LogContext";

export const useAnalyticAttributes = () => {
  const { logMetadata } = useLogContext();
  const { logType, renderingType } = logMetadata || {};

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (typeof window?.newrelic !== "object") {
      console.debug("Setting logType: ", logType);
      console.debug("Setting userId: ", userId);
      return;
    }

    const { newrelic } = window;
    if (logType !== undefined) {
      newrelic.setCustomAttribute("logType", logType);
    }
    if (userId !== null) {
      newrelic.setCustomAttribute("userId", userId);
    }
    if (renderingType !== undefined) {
      newrelic.setCustomAttribute("renderingType", renderingType);
    }
  }, [userId, logType, window?.newrelic, renderingType]);
};
