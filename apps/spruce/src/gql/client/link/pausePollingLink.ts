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
    operation.operationName &&
    pauseableQueries.includes(operation.operationName)
  ) {
    return new Observable((observer) => {
      const handleResume = () => {
        if (!document.hidden && navigator.onLine) {
          document.removeEventListener("visibilitychange", handleResume);
          window.removeEventListener("online", handleResume);
          forward(operation).subscribe(observer);
        }
      };
      document.addEventListener("visibilitychange", handleResume);
      window.addEventListener("online", handleResume);
    });
  }

  return forward(operation);
});

const pauseableQueries = ["Waterfall"];
