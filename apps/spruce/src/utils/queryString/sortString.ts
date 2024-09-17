import { Key, SorterResult } from "antd/es/table/interface";
import { Task, SortDirection } from "gql/generated/types";

export const getSortString = (columnKey: Key, direction: SortDirection) =>
  columnKey && direction ? `${columnKey}:${direction}` : undefined;

const shortenSortOrder = (order: string) =>
  order === "ascend" ? SortDirection.Asc : SortDirection.Desc;

// takes sort input from the antd table and translates into part of the query string
// if sort field is being unset, returns undefined
export const toSortString = (
  sorts: SorterResult<Task> | SorterResult<Task>[],
) => {
  let sortStrings: string[] = [];
  if (Array.isArray(sorts)) {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    sortStrings = sorts.map(({ columnKey, order }) =>
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      order ? getSortString(columnKey, shortenSortOrder(order)) : undefined,
    );
  } else {
    sortStrings = [
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      sorts.order
        ? // @ts-expect-error: FIXME. This comment was added by an automated script.
          getSortString(sorts.columnKey, shortenSortOrder(sorts.order))
        : undefined,
    ];
  }

  return sortStrings.some((s) => s)
    ? sortStrings.filter(Boolean).join(";")
    : undefined;
};

/**
 * Parses a sort query string or array into an array of sort objects.
 * The result is in the shape [{ [SortByKey]: SortCategoryEnum, [SortDirectionKey]: SortDirection }, ...]
 * @template SortByKey - The key for the sort category.
 * @template SortDirectionKey - The key for the sort direction.
 * @template SortCategoryEnum - The enum type for sort categories.
 * @template T - The type of the resulting sort objects, which must include
 *               both the sort category and direction.
 * @param sortQuery - A string or an array of strings representing the sort
 *                    criteria in the format "category:direction".
 * @param options - An object containing the following properties:
 * @param options.sortByKey - The key to use for the sort category in the resulting objects.
 * @param options.sortDirKey -  The key to use for the sort direction in the resulting objects.
 * @param options.sortCategoryEnum - An object that maps valid sort categories to their
 *                                   corresponding enum values.
 * @returns An array of sort objects, each containing the specified sort
 *          category and direction.
 */
export const parseSortString = <
  SortByKey extends string,
  SortDirectionKey extends string,
  SortCategoryEnum extends string,
  T extends Record<SortByKey, SortCategoryEnum> &
    Record<SortDirectionKey, SortDirection>,
>(
  sortQuery: string | string[],
  options: {
    sortByKey: SortByKey;
    sortDirKey: SortDirectionKey;
    sortCategoryEnum: Record<string, SortCategoryEnum>;
  },
): T[] => {
  const { sortByKey, sortCategoryEnum, sortDirKey } = options;
  const sortArray = Array.isArray(sortQuery) ? sortQuery : sortQuery.split(";");
  const sorts: T[] = sortArray.reduce((accum: T[], singleSort: string) => {
    const [category, direction] = singleSort.split(":");
    if (
      category &&
      direction &&
      Object.values(sortCategoryEnum).includes(category as SortCategoryEnum) &&
      Object.values(SortDirection).includes(direction as SortDirection)
    ) {
      accum.push({
        [sortByKey]: category as SortCategoryEnum,
        [sortDirKey]: direction as SortDirection,
      } as T);
    }
    return accum;
  }, []);
  return sorts;
};
