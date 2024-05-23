import { useState, useMemo, useEffect } from "react";
import debounce from "lodash.debounce";
import { FilterHookParams, FilterHookResult } from "hooks/useStatusesFilter";
import { useQueryParams } from "./useQueryParam";

/**
 * `useFilterInputChangeHandler` is a hook that manages updating filter inputs and updating the values to reflect the url.
 * @param params - filter hook params
 * @param params.urlParam - the url param to update
 * @param params.resetPage - whether or not to reset the page to 0 when the input value changes
 * @param params.sendAnalyticsEvent - callback to send analytics event when input value changes
 * @returns - the filter input state and its state management functions
 */
export const useFilterInputChangeHandler = ({
  resetPage,
  sendAnalyticsEvent = () => undefined,
  urlParam,
}: FilterHookParams): FilterHookResult<string> => {
  const [queryParams, setQueryParams] = useQueryParams();

  const urlValue = queryParams[urlParam] || "";
  const setQueryParamsWithDebounce = useMemo(
    () => debounce(setQueryParams, 250),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [inputValue, setInputValue] = useState(urlValue.toString());
  const page = resetPage && { page: "0" };

  useEffect(() => {
    if (!urlValue && inputValue) {
      setInputValue("");
    } else if (inputValue !== urlValue) {
      setInputValue(urlValue.toString());
    }
  }, [urlValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUrl = (newValue: string) => {
    setQueryParams({
      ...queryParams,
      [urlParam]: newValue || undefined,
      ...page,
    });
  };

  const setAndSubmitInputValue = (newValue: string): void => {
    setInputValue(newValue);
    setQueryParamsWithDebounce({
      ...queryParams,
      [urlParam]: newValue || undefined,
      ...page,
    });
    sendAnalyticsEvent(urlParam);
  };

  const submitInputValue = () => {
    updateUrl(inputValue);
    sendAnalyticsEvent(urlParam);
  };

  const reset = () => {
    setInputValue("");
    updateUrl("");
    sendAnalyticsEvent(urlParam);
  };

  return {
    inputValue,
    setAndSubmitInputValue,
    setInputValue,
    submitInputValue,
    reset,
  };
};
