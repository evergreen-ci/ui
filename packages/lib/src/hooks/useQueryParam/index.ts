import { useCallback, useEffect, useMemo, useRef } from "react";
import { ParseOptions } from "query-string";
import { useNavigate, useSearchParams } from "react-router-dom";
import { conditionalToArray } from "../../utils/array";
import { parseQueryString, stringifyQuery } from "../../utils/query-string";

type QueryParams = { [key: string]: unknown };
type QueryParamsUpdater = QueryParams | ((current: QueryParams) => QueryParams);
type SetQueryParams = (params: QueryParamsUpdater) => void;

/**
 * `useQueryParams` returns all of the query params that exist in the url.
 * @param parseOptions - options which define how to parse params from the url (optional)
 * @returns a tuple containing the parsed query params and a function to set the query params.
 * The setter supports both direct values and functional updates (like useState).
 */
const useQueryParams = (
  parseOptions?: ParseOptions,
): readonly [QueryParams, SetQueryParams] => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchParamsObject = useMemo(
    () => parseQueryString(searchParams.toString(), parseOptions ?? {}),
    [searchParams, parseOptions],
  );

  // Use a ref to track current params so the setter can read fresh values
  // without needing searchParams in its dependency array.
  // This is necessary because react-router-dom's setSearchParams is not stable.
  const paramsRef = useRef(searchParamsObject);
  useEffect(() => {
    paramsRef.current = searchParamsObject;
  }, [searchParamsObject]);

  const setQueryString = useCallback(
    (updater: QueryParamsUpdater) => {
      const currentParams = paramsRef.current;
      const newParams =
        typeof updater === "function" ? updater(currentParams) : updater;

      const stringifiedQuery = stringifyQuery(newParams, {
        skipEmptyString: false,
      });
      navigate(`?${stringifiedQuery}`, { replace: true });
    },
    [navigate],
  );

  return [searchParamsObject, setQueryString] as const;
};

/**
 * `useQueryParam` allows you to interact with a query param in the same way you would use a useState hook.
 * The first argument is the name of the query param. The second argument is the initial value of the query param.
 * `useQueryParam` will default to the second argument if the query param is not present in the url.
 * @param param - the name of the query param
 * @param defaultParam - the default value of the query param
 * @param parseOptions - options which define how to parse params from the url (optional)
 * @returns a tuple containing the parsed query param and a function to set the query param.
 * The setter has a stable identity and will not change between renders.
 */
const useQueryParam = <T>(
  param: string,
  defaultParam: T,
  parseOptions?: ParseOptions,
): readonly [T, (set: T) => void] => {
  const [searchParams, setSearchParams] = useQueryParams(parseOptions);

  // Capture the initial defaultParam to avoid recomputation when callers
  // pass inline arrays/objects (e.g., useQueryParam("filters", []))
  const defaultParamRef = useRef(defaultParam);

  const setQueryParam = useCallback(
    (value: T) => {
      setSearchParams((current) => ({
        ...current,
        [param]: value,
      }));
    },
    [setSearchParams, param],
  );

  // This lint error is a false positive: https://github.com/facebook/react/issues/34775
  /* eslint-disable react-hooks/refs */
  const queryParam = useMemo(
    () =>
      searchParams[param] !== undefined
        ? (conditionalToArray(
            searchParams[param],
            Array.isArray(defaultParamRef.current),
          ) as unknown as T)
        : defaultParamRef.current,
    [searchParams, param],
  );

  return [queryParam, setQueryParam] as const;
  /* eslint-enable react-hooks/refs */
};

export { useQueryParams, useQueryParam };
