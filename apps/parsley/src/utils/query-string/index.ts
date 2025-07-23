import { CaseSensitivity, MatchType } from "constants/enums";
import { Filter, Filters } from "types/logs";

/**
 * Parse a list of filters.
 * @param filters - The filters to parse.
 * @returns A list of parsed filters.
 */
export const parseFilters = (filters: string[]): Filters =>
  filters.map((f) => parseFilter(f));

/**
 * Parse a single filter.
 * @param filterString - The filter to parse.
 * @returns A parsed filter.
 */
export const parseFilter = (filterString: string): Filter => {
  // Ensure that a filter is a string before parsing it.
  const filter = filterString.toString();

  const visible = filter.charAt(0) === "1";
  const caseSensitive =
    filter.charAt(1) === "1"
      ? CaseSensitivity.Sensitive
      : CaseSensitivity.Insensitive;
  const matchType =
    filter.charAt(2) === "1" ? MatchType.Inverse : MatchType.Exact;
  const expression = filter.substring(3);
  const decodedFilterExpression = decodeURIComponent(expression);
  return {
    caseSensitive,
    expression: decodedFilterExpression,
    matchType,
    visible,
  };
};

/**
 * Stringify a list of filters.
 * @param filters - The filters to stringify.
 * @returns A list of stringified filters.
 */
export const stringifyFilters = (filters: Filters): string[] =>
  filters.map((f) => stringifyFilter(f));

/**
 * Stringify a single filter.
 * @param filter - The filter to stringify.
 * @returns A stringified filter.
 */
export const stringifyFilter = (filter: Filter): string => {
  const visible = filter.visible ? 1 : 0;
  const caseSensitive =
    filter.caseSensitive === CaseSensitivity.Sensitive ? 1 : 0;
  const matchType = filter.matchType === MatchType.Inverse ? 1 : 0;
  const encodedFilterName = encodeURIComponent(filter.expression);
  return `${visible}${caseSensitive}${matchType}${encodedFilterName}`;
};
