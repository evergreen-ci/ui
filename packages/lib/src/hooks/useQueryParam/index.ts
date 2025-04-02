import { useCallback, useMemo } from "react";
import { ParseOptions } from "query-string";
import { useNavigate, useSearchParams } from "react-router-dom";
import { conditionalToArray } from "../../utils/array";
import { parseQueryString, stringifyQuery } from "../../utils/query-string";

/**
 * `useQueryParams` returns all of the query params that exist in the url.
 * @param parseOptions - options which define how to parse params from the url (optional)
 * @returns a tuple containing the parsed query params and a function to set the query params
 */
export const useQueryParams = (parseOptions?: ParseOptions) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const setQueryString = useCallback(
    (params: { [key: string]: unknown }) => {
      const stringifiedQuery = stringifyQuery(params, {
        skipEmptyString: false,
      });

      if (navigate) {
        navigate(`?${stringifiedQuery}`, { replace: true });
      } else {
        setSearchParams(new URLSearchParams(stringifiedQuery), {
          replace: true,
        });
      }
    },
    [navigate, setSearchParams],
  );

  const parsedQueryString = useMemo(
    () => parseQueryString(searchParams.toString(), parseOptions),
    [searchParams, parseOptions],
  );

  return [parsedQueryString, setQueryString] as const;
};

/**
 * `useQueryParam` allows you to interact with a query param in the same way you would use a useState hook.
 * @param param - the name of the query param
 * @param defaultParam - the default value of the query param
 * @param parseOptions - options which define how to parse params from the url (optional)
 * @returns a tuple containing the parsed query param and a function to set the query param
 */
export const useQueryParam = <T>(
  param: string,
  defaultParam: T,
  parseOptions?: ParseOptions,
): readonly [T, (set: T) => void] => {
  const [searchParams, setSearchParams] = useQueryParams(parseOptions);

  const setQueryParam = useCallback(
    (value: T) => {
      const newParams = {
        ...searchParams,
      };

      Object.entries(newParams).forEach(([paramKey, paramValue]) => {
        if (paramValue === undefined) {
          delete newParams[paramKey];
        }
        if (Array.isArray(paramValue)) {
          newParams[paramKey] = paramValue.map((v) =>
            v !== null ? encodeURIComponent(v) : null,
          );
        }
      });

      setSearchParams({
        ...newParams,
        [param]: value,
      });
    },
    [setSearchParams, searchParams, param],
  );

  const queryParam =
    searchParams[param] !== undefined
      ? (conditionalToArray(
          searchParams[param],
          Array.isArray(defaultParam),
        ) as unknown as T)
      : defaultParam;

  return [queryParam, setQueryParam] as const;
};
