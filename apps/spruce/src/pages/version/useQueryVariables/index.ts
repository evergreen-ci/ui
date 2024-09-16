import {
  VersionTasksQueryVariables,
  SortOrder,
  TaskSortCategory,
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
    [PatchTasksQueryParams.Duration]: duration,
    [PatchTasksQueryParams.Sorts]: sorts,
    [PatchTasksQueryParams.Variant]: variant,
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Statuses]: statuses,
    [PatchTasksQueryParams.BaseStatuses]: baseStatuses,
  } = queryParams;

  // This should be reworked once the antd tables are removed.
  // At the current state, sorts & duration will never both be defined.
  let sortsToApply: SortOrder[] = [];
  const opts = {
    sortByKey: "Key" as "Key",
    sortDirKey: "Direction" as "Direction",
    sortCategoryEnum: TaskSortCategory,
  };
  if (sorts) {
    sortsToApply = parseSortString<
      "Key",
      "Direction",
      TaskSortCategory,
      SortOrder
    >(sorts, opts);
  }
  if (duration) {
    sortsToApply = parseSortString<
      "Key",
      "Direction",
      TaskSortCategory,
      SortOrder
    >(`${TaskSortCategory.Duration}:${duration}`, opts);
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
