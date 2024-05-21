import { SortDirection } from "gql/generated/types";

type WithDirection<K extends string> = {
  direction: SortDirection;
} & Record<K, any>;

export const getSortString = (columnKey: string, direction: SortDirection) =>
  columnKey && direction ? `${columnKey}:${direction}` : "";

/**
 * Takes sort input from a table and translates it into part of the query string.
 * If the sort field is being unset, returns undefined.
 * @param arr - The array of sort fields to use.
 * @param key - The key to use for the sort field.
 * @returns The translated part of the query string, or undefined if the sort field is being unset.
 */
export const toSortString = <K extends string>(
  arr: WithDirection<K>[],
  key: K,
): string => {
  const sortStrings: string[] = arr.map(({ direction, [key]: sortKey }) =>
    getSortString(sortKey, direction),
  );

  return sortStrings.filter(Boolean).join(";");
};

/**
 * Takes a sort query string and parses it into valid GQL params.
 * By default, uses keys for task's SortOrder type, but sort field keys can be passed in for use with e.g. tests' TestSortOptions.
 * @param str The sort query string.
 * @param key The key to use for the sort field.
 * @returns The parsed sort query string.
 */
export const parseSortString = <K extends string>(
  str: string,
  key: K,
): WithDirection<K>[] => {
  const arr = str.split(";").map((item) => {
    const [sortKey, direction] = item.split(":");
    if (!sortKey || !direction) {
      return undefined;
    }
    if (!Object.values(SortDirection).includes(direction as SortDirection)) {
      return undefined;
    }
    return {
      direction,
      [key]: sortKey,
    } as WithDirection<K>;
  });

  return arr.filter(Boolean);
};
