import { TableQueryParams } from "constants/queryParams";
import {
  VersionTasksQueryVariables,
  SortOrder,
  TaskSortCategory,
  SortDirection,
} from "gql/generated/types";
import usePagination from "hooks/usePagination";
import { PatchTasksQueryParams } from "types/task";
import { queryString, array } from "utils";

const { getString, parseQueryString, parseSortString } = queryString;
const { toArray } = array;

export const useQueryVariables = (
  search: string,
  versionId: string,
): VersionTasksQueryVariables => {
  const { limit, page } = usePagination();
  const queryParams = parseQueryString(search);
  const {
    [TableQueryParams.Sorts]: sorts,
    [PatchTasksQueryParams.Variant]: variant,
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Statuses]: statuses,
    [PatchTasksQueryParams.BaseStatuses]: baseStatuses,
  } = queryParams;

  // This should be reworked once the antd tables are removed.
  // At the current state, sorts & duration will never both be defined.
  let sortsToApply: SortOrder[] = [];
  const taskSortCategories: string[] = Object.values(TaskSortCategory);
  const parsedSortBy = getString(queryParams[TableQueryParams.SortBy]);
  const sortBy = taskSortCategories.includes(parsedSortBy)
    ? (parsedSortBy as TaskSortCategory)
    : undefined;
  const parsedSortDir = getString(queryParams[TableQueryParams.SortDir]);
  const sortDir =
    parsedSortDir === SortDirection.Desc
      ? SortDirection.Desc
      : SortDirection.Asc;

  if (sortBy && sortDir) {
    sortsToApply = [{ Key: sortBy, Direction: sortDir }];
  } else if (sorts) {
    sortsToApply = parseSortString<
      "Key",
      "Direction",
      TaskSortCategory,
      SortOrder
    >(sorts, {
      sortByKey: "Key",
      sortDirKey: "Direction",
      sortCategoryEnum: TaskSortCategory,
    });
  }

  return {
    versionId,
    taskFilterOptions: {
      variant: getString(variant),
      taskName: getString(taskName),
      statuses: toArray(statuses),
      baseStatuses: toArray(baseStatuses),
      sorts: sortsToApply,
      limit,
      page,
    },
  };
};
