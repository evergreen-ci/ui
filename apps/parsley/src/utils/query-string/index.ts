import { CaseSensitivity, MatchType } from "constants/enums";
import { Filters } from "types/logs";

export const parseFilters = (filters: string[]): Filters => {
  const parsedFilters: Filters = filters.map((f) => {
    // Ensure that a filter is a string before parsing it.
    const filter = f.toString();

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
  });
  return parsedFilters;
};

export const stringifyFilters = (filters: Filters): string[] =>
  filters.map((f) => {
    const visible = f.visible ? 1 : 0;
    const caseSensitive = f.caseSensitive === CaseSensitivity.Sensitive ? 1 : 0;
    const matchType = f.matchType === MatchType.Inverse ? 1 : 0;
    const encodedFilterName = encodeURIComponent(f.expression);
    return `${visible}${caseSensitive}${matchType}${encodedFilterName}`;
  });
