import { useCallback, useMemo } from "react";
import { conditionalToArray } from "@evg-ui/lib/utils/array";
import { QueryParams } from "constants/queryParams";
import { useQueryParams } from "hooks/useQueryParam";
import { Filters } from "types/logs";
import { parseFilters, stringifyFilters } from "utils/query-string";

/**
 * `useFilterParam` is a specialized form of useQueryParam. It needs to do special processing when converting
 * filters to and from URLs.
 * @returns a tuple containing the parsed filters and a function to set the filters
 */
const useFilterParam = () => {
  const [searchParams, setSearchParams] = useQueryParams({
    parseNumbers: false,
  });

  const parsedFilters = useMemo(
    () =>
      parseFilters(
        conditionalToArray(searchParams.filters ?? [], true) as string[],
      ),
    [searchParams.filters],
  );

  const setFiltersParam = useCallback(
    (filters: Filters) => {
      setSearchParams({
        ...searchParams,
        [QueryParams.Filters]: stringifyFilters(filters),
      });
    },
    [setSearchParams, searchParams],
  );

  return [parsedFilters, setFiltersParam] as const;
};

export { useFilterParam };
