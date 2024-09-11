import { useEffect } from "react";
import { useLogContext } from "context/LogContext";

export const useAnalyticAttributes = () => {
  const { logMetadata } = useLogContext();
  const { logType, renderingType } = logMetadata || {};
  const { AttributeStore } = window;

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!AttributeStore) {
      console.error("AttributeStore not found in window object");
      return;
    }
    if (logType !== undefined) {
      AttributeStore.setGlobalAttribute("log.type", logType);
    }
    if (userId !== null) {
      AttributeStore.setGlobalAttribute("user.id", userId);
    }
    if (renderingType !== undefined) {
      AttributeStore.setGlobalAttribute("rendering.type", renderingType);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, logType, renderingType]);
};
