import { useEffect, useRef } from "react";

/**
 * useQueryCompleted executes a callback when a GraphQL query completes.
 * It tracks whether the callback has been executed to avoid duplicate calls.
 * This is a replacement for Apollo's deprecated onCompleted callback.
 * @param loading - The loading state from useQuery or useLazyQuery
 * @param callback - The function to execute when the query completes
 * @example
 * const { data, loading } = useQuery(MY_QUERY);
 * useQueryCompleted(loading, () => {
 *   console.log("Query completed");
 * });
 */
export const useQueryCompleted = (loading: boolean, callback: () => void) => {
  const hasCompletedRef = useRef(false);
  const wasLoadingRef = useRef(loading);

  useEffect(() => {
    // When loading transitions from true to false, execute the callback.
    if (wasLoadingRef.current && !loading && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      callback();
    }

    // Track loading state for next render.
    wasLoadingRef.current = loading;

    // Reset when query starts loading again (e.g. from refetch).
    if (loading && hasCompletedRef.current) {
      hasCompletedRef.current = false;
    }
  }, [loading, callback]);
};
