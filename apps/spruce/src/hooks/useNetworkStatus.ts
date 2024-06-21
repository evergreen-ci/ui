import { useEffect, useState } from "react";

/**
 * This hook sets an eventListener to monitor if the browser is online or offline.
 * @returns boolean - true if online, false if offline
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOffline = () => {
      // Don't send event because we can't send events if the browser is offline.
      setIsOnline(false);
      console.log("You are offline.");
    };
    const handleOnline = () => {
      setIsOnline(true);
      console.log("You are online.");
    };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return isOnline;
};
