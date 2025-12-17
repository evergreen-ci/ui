import { useEffect, useRef } from "react";
import { ApolloError } from "@apollo/client";
import { useToastContext } from "@evg-ui/lib/context/toast";

/**
 * useErrorToast displays an error toast when a GraphQL query fails.
 * It tracks the error message to avoid showing duplicate toasts for the same error.
 * @param error - The error from useQuery or useLazyQuery
 * @param messagePrefix - A human-readable prefix describing what failed (e.g., "Unable to load files")
 * @example
 * const { data, error } = useQuery(MY_QUERY);
 * useErrorToast(error, "Unable to load data");
 * // Shows toast: "Unable to load data: <error message>"
 */
export const useErrorToast = (
  error: ApolloError | undefined,
  messagePrefix: string,
) => {
  const dispatchToast = useToastContext();
  const lastErrorMessage = useRef<string | null>(null);

  useEffect(() => {
    // Only show toast if there's a new error we haven't shown yet
    if (error && error.message !== lastErrorMessage.current) {
      lastErrorMessage.current = error.message;
      dispatchToast.error(`${messagePrefix}: ${error.message}`);
    }
    // Clear tracked error when error is resolved
    if (!error) {
      lastErrorMessage.current = null;
    }
  }, [error, messagePrefix, dispatchToast]);
};
