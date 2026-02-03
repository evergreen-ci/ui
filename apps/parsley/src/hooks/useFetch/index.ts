import { useEffect, useState } from "react";
import {
  SentryBreadcrumbTypes,
  leaveBreadcrumb,
  reportError,
} from "@evg-ui/lib/utils";
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
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(req, {
            credentials: "include",
            // Conditionally define signal because AbortController throws error in development's strict mode
            signal: isProduction() ? abortController.signal : undefined,
          });

          if (!response.ok) {
            throw new Error(`making request: ${response.status}`);
          }

          const json = (await response.json()) || {};
          setData(json);
        } catch (err: unknown) {
          const errorObj = err as Error;
          leaveBreadcrumb(
            "useFetch",
            { err: errorObj, url },
            SentryBreadcrumbTypes.Error,
          );
          reportError(errorObj).severe();
          setError(errorObj.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
    return () => {
      // Cancel the request if the component unmounts
      abortController.abort();
    };
  }, [url, skip]);

  return { data, error, isLoading };
};

export { useFetch };
