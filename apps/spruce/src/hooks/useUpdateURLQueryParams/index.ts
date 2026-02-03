import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { stringifyQuery } from "@evg-ui/lib/utils";
import { queryString } from "utils";

const { parseQueryString } = queryString;

export const useUpdateURLQueryParams = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const updateQueryParams = useCallback(
    (nextQueryParams: StringMap) => {
      const joinedParams = {
        ...parseQueryString(search),
        ...nextQueryParams,
      };
      navigate(`${pathname}?${stringifyQuery(joinedParams)}`, {
        replace: true,
      });
    },
    [navigate, search, pathname],
  );

  return updateQueryParams;
};

interface StringMap {
  [index: string]: string | string[];
}
