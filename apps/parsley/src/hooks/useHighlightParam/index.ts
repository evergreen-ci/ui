import { useCallback, useMemo } from "react";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { conditionalToArray } from "@evg-ui/lib/utils/array";
import { QueryParams, urlParseOptions } from "constants/queryParams";

/**
 * `safeDecodeURIComponent` decodes a URI component, falling back to the raw value
 * when the component is malformed. This prevents a `URIError` from crashing the app
 * when a highlight in the URL contains an invalid percent-encoding sequence.
 * @param value - The value to decode.
 * @returns The decoded value, or the original value if decoding fails.
 */
const safeDecodeURIComponent = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

/**
 * `useHighlightParam` is a specialized form of useQueryParam. It needs to encode and decode the highlights
 * to and from URLs.
 * @returns a tuple containing the parsed highlights and a function to set the highlights
 */
const useHighlightParam = () => {
  const [searchParams, setSearchParams] = useQueryParams(urlParseOptions);

  const parsedHighlights = useMemo(
    () =>
      (conditionalToArray(searchParams.highlights ?? [], true) as string[]).map(
        (h) => safeDecodeURIComponent(h),
      ),
    [searchParams.highlights],
  );

  const setHighlightsParam = useCallback(
    (newHighlights: string[]) => {
      setSearchParams({
        ...searchParams,
        [QueryParams.Highlights]: newHighlights.map((highlight) =>
          // We need to encode the highlights twice because the URL will decode them once
          encodeURIComponent(highlight),
        ),
      });
    },
    [setSearchParams, searchParams],
  );

  return [parsedHighlights, setHighlightsParam] as const;
};

export { useHighlightParam };
