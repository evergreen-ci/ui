import { useCallback } from "react";
import { useQueryParams } from "@evg-ui/lib/hooks";

export const useUpdateURLQueryParams = () => {
  const [, setQueryParams] = useQueryParams();
  const updateQueryParams = useCallback(
    (nextQueryParams: StringMap) => {
      setQueryParams((current) => ({
        ...current,
        ...nextQueryParams,
      }));
    },
    [setQueryParams],
  );

  return updateQueryParams;
};

interface StringMap {
  [index: string]: string | string[];
}
