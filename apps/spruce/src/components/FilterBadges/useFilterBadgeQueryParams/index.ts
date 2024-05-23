import { useQueryParams } from "hooks/useQueryParam";
import { array } from "utils";
import { FilterBadgeType } from "../FilterBadge";

const { convertObjectToArray } = array;

/**
 * useFilterBadgeQueryParams is used alongside the FilterBadges component to tie its state to query params
 * @param validQueryParams - a set of valid query params that the FilterBadges component can use
 * @returns - an object with the following properties:
 * `queryParamsList` - a list of badges that are currently in the query params
 * `handleClearAll` - a function that clears all badges from the query params
 * `handleOnRemove` - a function that removes a badge from the query params
 */
const useFilterBadgeQueryParams = (validQueryParams: Set<string>) => {
  const [queryParams, setQueryParams] = useQueryParams();
  const queryParamsList = convertObjectToArray(queryParams)
    .filter(({ key }) => validQueryParams.has(key))
    .map((param) => ({ key: param.key, value: param.value.toString() }));

  const handleClearAll = () => {
    const params = { ...queryParams };
    Object.keys(params)
      .filter((badge) => validQueryParams.has(badge))
      .forEach((v) => {
        params[v] = undefined;
      });
    setQueryParams(params);
  };
  const handleOnRemove = (badge: FilterBadgeType) => {
    let updatedParam;
    const queryParamValue = queryParams[badge.key];
    if (Array.isArray(queryParamValue)) {
      updatedParam = popQueryParams(queryParamValue, badge.value);
    }
    setQueryParams({ [badge.key]: updatedParam });
  };

  return {
    badges: queryParamsList,
    handleClearAll,
    handleOnRemove,
  };
};

const popQueryParams = <T>(param: T[], value: T) =>
  param.filter((p) => p !== value);

export default useFilterBadgeQueryParams;
