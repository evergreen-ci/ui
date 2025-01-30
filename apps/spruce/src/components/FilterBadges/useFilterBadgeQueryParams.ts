import { useLocation } from "react-router-dom";
import { toSentenceCase } from "@evg-ui/lib/utils/string";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { queryString, array } from "utils";
import { FilterBadgeType } from "./FilterBadge";

const { convertObjectToArray } = array;
const { parseQueryString } = queryString;

/**
 * useFilterBadgeQueryParams is used alongside the FilterBadges component to tie its state to query params
 * @param validQueryParams - a set of valid query params that the FilterBadges component can use
 * @param urlParamToTitleMap - a map of the url param to the title that should be shown in the badge
 * @returns - an object with the following properties:
 * `queryParamsList` - a list of badges that are currently in the query params
 * `handleClearAll` - a function that clears all badges from the query params
 * `handleOnRemove` - a function that removes a badge from the query params
 */
const useFilterBadgeQueryParams = (
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

  const badges = queryParamsList.map((q) => ({
    ...q,
    title: urlParamToTitleMap?.[q.key] ?? toSentenceCase(q.key),
  }));

  const handleClearAll = () => {
    const params = { ...queryParams };
    Object.keys(params)
      .filter((badge) => validQueryParams.has(badge))
      .forEach((v) => {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        params[v] = undefined;
      });
    updateQueryParams(params);
  };
  const handleOnRemove = (badge: FilterBadgeType) => {
    const updatedParam = popQueryParams(queryParams[badge.key], badge.value);
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    updateQueryParams({ [badge.key]: updatedParam });
  };

  return {
    badges,
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

export default useFilterBadgeQueryParams;
