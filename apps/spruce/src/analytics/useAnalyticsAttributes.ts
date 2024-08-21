import { useEffect } from "react";

export const useAnalyticsAttributes = () => {
  const userId = localStorage.getItem("userId");

  // TODO: Replace this with honeycomb equivalent
  useEffect(() => {
    if (true) {
      console.log("Setting userId: ", userId);
      return;
    }
    if (userId !== null) {
      // newrelic.setCustomAttribute("userId", userId);
    }
  }, [userId]);
};
