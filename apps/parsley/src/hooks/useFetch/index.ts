import { useEffect, useState } from "react";
import { leaveBreadcrumb, reportError } from "@evg-ui/lib/utils/errorReporting";
import { SentryBreadcrumbTypes } from "@evg-ui/lib/utils/sentry/types";
import { isProduction } from "utils/environmentVariables";
/**
 * `useFetch` is a custom hook that downloads json from a given URL.
 * @param url - the url to fetch
 * @param options - optional parameters
 * @param options.skip - if true, skip the fetch
 * @returns an object with the following properties:
 * - isLoading: a boolean that is true while the log is being downloaded
 * - data: the log file as an array of strings
 * - error: an error message if the download fails
 */
const useFetch = <T extends object>(
  url: string,
  options?: {
    skip?: boolean;
  },
) => {
  const { skip = false } = options || {};

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    leaveBreadcrumb("useFetch", { url }, SentryBreadcrumbTypes.HTTP);
    const req = new Request(url, { method: "GET" });
    const abortController = new AbortController();

    if (!skip) {
      setIsLoading(true);
      fetch(req, {
        credentials: "include",
        // Conditionally define signal because AbortController throws error in development's strict mode
        signal: isProduction() ? abortController.signal : undefined,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`making request: ${response.status}`);
          }
          return response;
        })
        .then((response) => response.json() || {})
        .then((json) => {
          setData(json);
        })
        .catch((err: Error) => {
          leaveBreadcrumb(
            "useFetch",
            { err, url },
            SentryBreadcrumbTypes.Error,
          );
          reportError(err).severe();
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    return () => {
      // Cancel the request if the component unmounts
      abortController.abort();
    };
  }, [url, skip]);
  return { data, error, isLoading };
};

export { useFetch };
