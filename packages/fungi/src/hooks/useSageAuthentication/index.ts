import { useCallback, useEffect, useState } from "react";

/**
 * `useSageAuthentication` is a hook that checks if the user is authenticated with Sage.
 * @param loginUrl - The URL to check if the user is authenticated with Sage.
 * @returns An object with the following properties:
 * - isSageAuthenticated: A boolean that is true if the user is authenticated with Sage.
 * - beginPollingIsSageAuthenticated: A function that begins polling for Sage authentication.
 * - isPolling: A boolean that is true if polling for Sage authentication is in progress.
 */
const useSageAuthentication = (loginUrl: string) => {
  const [isSageAuthenticated, setIsSageAuthenticated] = useState(true);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const beginPollingIsSageAuthenticated = useCallback(() => {
    // Clear any existing interval before starting a new one
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    const newIntervalId = setInterval(checkIsSageAuthenticated, 10000);
    setIntervalId(newIntervalId);
  }, [intervalId]);

  const checkIsSageAuthenticated = useCallback(async () => {
    try {
      const response = await fetch(loginUrl, { credentials: "include" });
      if (response.ok) {
        setIsSageAuthenticated(true);
        // Clear interval when authenticated
        if (intervalId) {
          clearInterval(intervalId);
          setIntervalId(null);
        }
      } else {
        setIsSageAuthenticated(false);
      }
    } catch (error) {
      setIsSageAuthenticated(false);
    }
  }, [loginUrl, intervalId]);

  // Initial check for authentication
  useEffect(() => {
    checkIsSageAuthenticated();
  }, [checkIsSageAuthenticated]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    },
    [intervalId],
  );

  return {
    isSageAuthenticated,
    beginPollingIsSageAuthenticated,
    isPolling: intervalId !== null,
  };
};

export default useSageAuthentication;
