import { ApolloLink, Observable } from "@apollo/client";

/**
 * This link pauses polling for specific queries when the document is hidden
 * or when the browser is offline. It resumes polling when the document becomes
 * visible or the browser goes back online.
 *
 */
export const pausePollingLink = new ApolloLink((operation, forward) => {
  if (
    (document.hidden || !navigator.onLine) &&
    pauseableQueries.includes(operation.operationName)
  ) {
    return new Observable((observer) => {
      const handleResume = () => {
        if (!document.hidden && navigator.onLine) {
          document.removeEventListener(VISIBILITY_LISTENER, handleResume);
          window.removeEventListener(ONLINE_LISTENER, handleResume);
          forward(operation).subscribe(observer);
        }
      };

      document.addEventListener(VISIBILITY_LISTENER, handleResume);
      window.addEventListener(ONLINE_LISTENER, handleResume);
    });
  }

  return forward(operation);
});
export const VISIBILITY_LISTENER = "visibilityChangePausePollingLink";
export const ONLINE_LISTENER = "onlinePausePollingLink";

const pauseableQueries = ["Waterfall"];
