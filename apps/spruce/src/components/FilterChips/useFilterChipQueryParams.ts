import { useLocation } from "react-router-dom";
import { toSentenceCase } from "@evg-ui/lib/utils";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { queryString, array } from "utils";
import { FilterChipType } from "./FilterChip";

const { convertObjectToArray } = array;
const { parseQueryString } = queryString;

/**
 * useFilterChipQueryParams is used alongside the FilterChips component to tie its state to query params
 * @param validQueryParams - a set of valid query params that the FilterChips component can use
 * @param urlParamToTitleMap - a map of the url param to the title that should be shown in the chip
 * @returns - an object with the following properties:
 * `queryParamsList` - a list of chips that are currently in the query params
 * `handleClearAll` - a function that clears all chips from the query params
 * `handleOnRemove` - a function that removes a chip from the query params
 */
const useFilterChipQueryParams = (
  validQueryParams: Set<string>,
  urlParamToTitleMap?: { [urlParam: string]: string },
) => {
  const updateQueryParams = useUpdateURLQueryParams();
  const location = useLocation();
  const { search } = location;
  const queryParams = parseQueryString(search);
  const queryParamsList = convertObjectToArray(queryParams).filter(({ key }) =>
    validQueryParams.has(key as string),
  );

  const chips = queryParamsList.map((q) => ({
    ...q,
    title: urlParamToTitleMap?.[q.key] ?? toSentenceCase(q.key),
  }));

  const handleClearAll = () => {
    const params = { ...queryParams };
    Object.keys(params)
      .filter((chip) => validQueryParams.has(chip))
      .forEach((v) => {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        params[v] = undefined;
      });
    updateQueryParams(params);
  };
  const handleOnRemove = (chip: FilterChipType) => {
    const updatedParam = popQueryParams(queryParams[chip.key], chip.value);
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    updateQueryParams({ [chip.key]: updatedParam });
  };

  return {
    chips,
    handleClearAll,
    handleOnRemove,
  };
};

const popQueryParams = (param: string | string[], value: string) => {
  if (Array.isArray(param)) {
    return param.filter((p) => p !== value);
  }
  return undefined;
};

export default useFilterChipQueryParams;
