import { useEffect } from "react";
import { useLogContext } from "context/LogContext";

export const useAnalyticAttributes = () => {
  const { logMetadata } = useLogContext();
  const { logType, renderingType } = logMetadata || {};

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // FIXME: Remove this block after testing
    if (true) {
      console.debug("Setting logType: ", logType);
      console.debug("Setting userId: ", userId);
    }
    // TODO: Replace this with honeycomb equivalent
    // const { newrelic } = window;
    // if (logType !== undefined) {
    //   newrelic.setCustomAttribute("logType", logType);
    // }
    // if (userId !== null) {
    //   newrelic.setCustomAttribute("userId", userId);
    // }
    // if (renderingType !== undefined) {
    //   newrelic.setCustomAttribute("renderingType", renderingType);
    // }
  }, [userId, logType, renderingType]);
};
