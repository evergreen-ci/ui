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
