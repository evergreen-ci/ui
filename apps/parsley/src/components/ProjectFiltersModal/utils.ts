import { CaseSensitivity, MatchType } from "constants/enums";
import { ParsleyFilter } from "gql/generated/types";
import { Filter } from "types/logs";

/**
 * Convert a Parsley filter to a filter.
 * @param filter - The Parsley filter to convert.
 * @returns The converted filter.
 */
export const convertParsleyFilterToFilter = (
  filter: ParsleyFilter,
): Filter => ({
  caseSensitive: filter.caseSensitive
    ? CaseSensitivity.Sensitive
    : CaseSensitivity.Insensitive,
  expression: filter.expression,
  matchType: filter.exactMatch ? MatchType.Exact : MatchType.Inverse,
  visible: true,
});
