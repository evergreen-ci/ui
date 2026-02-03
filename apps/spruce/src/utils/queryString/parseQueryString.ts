import queryString from "query-string";
import { PAGE_SIZES } from "@evg-ui/lib/constants";
import { getDefaultPageSize } from "@evg-ui/lib/utils";

interface ParseQueryString {
  [key: string]: string | string[];
}
export const parseQueryString = (search: string): ParseQueryString =>
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  queryString.parse(search, { arrayFormat: "comma" });

export const getString = (param: string | string[] = ""): string =>
  Array.isArray(param) ? param[0] : param;

export const queryParamAsNumber = (str: string | string[]) =>
  !Number.isNaN(Number(str)) ? Number(str) : null;

export const getLimit = (param: string | string[]) => {
  const limit = queryParamAsNumber(param);
  return limit !== null && PAGE_SIZES.includes(limit)
    ? limit
    : getDefaultPageSize();
};

export const getPage = (param: string | string[]) => {
  const page = queryParamAsNumber(param);
  return page !== null && page > 0 ? page : 0;
};
