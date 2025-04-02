import { useCallback } from "react";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { conditionalToArray } from "@evg-ui/lib/utils/array";
import { QueryParams } from "constants/queryParams";
import { Filters } from "types/logs";
import { parseFilters, stringifyFilters } from "utils/query-string";

/**
 * `useFilterParam` is a specialized form of useQueryParam. It needs to do special processing when converting
 * filters to and from URLs.
 * @returns a tuple containing the parsed filters and a function to set the filters
 */
const useFilterParam = () => {
  const [searchParams, setSearchParams] = useQueryParams();

  const parsedFilters = parseFilters(
    conditionalToArray(searchParams.filters ?? [], true) as string[],
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
