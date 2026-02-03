import { useCallback, useMemo } from "react";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { conditionalToArray } from "@evg-ui/lib/utils";
import { QueryParams, urlParseOptions } from "constants/queryParams";
import { Filters } from "types/logs";
import { parseFilters, stringifyFilters } from "utils/query-string";

/**
 * `useFilterParam` is a specialized form of useQueryParam. It needs to do special processing when converting
 * filters to and from URLs.
 * @returns a tuple containing the parsed filters and a function to set the filters
 */
const useFilterParam = (): [Filters, (filters: Filters) => void] => {
  const [searchParams, setSearchParams] = useQueryParams(urlParseOptions);

  const filtersParam = searchParams[QueryParams.Filters];
  const restParams = useMemo(() => {
    const { [QueryParams.Filters]: _, ...rest } = searchParams;
    return rest;
  }, [searchParams]);

  const parsedFilters = useMemo(
    () =>
      parseFilters(conditionalToArray(filtersParam ?? [], true) as string[]),
    [filtersParam],
  );

  const setFiltersParam = useCallback(
    (filters: Filters) => {
      setSearchParams({
        ...restParams,
        [QueryParams.Filters]: stringifyFilters(filters),
      });
    },
    [setSearchParams, restParams],
  );

  return [parsedFilters, setFiltersParam];
};

export { useFilterParam };
