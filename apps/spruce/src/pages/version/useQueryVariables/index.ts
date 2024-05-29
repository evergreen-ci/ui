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
  let sortsToApply: SortOrder[];
  if (sorts) {
    sortsToApply = parseSortString(sorts);
  }
  if (duration) {
    sortsToApply = parseSortString(`${TaskSortCategory.Duration}:${duration}`);
  }

  return {
    versionId,
    taskFilterOptions: {
      variant: getString(variant),
      taskName: getString(taskName),
      statuses: toArray(statuses),
      baseStatuses: toArray(baseStatuses),
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      sorts: sortsToApply,
      limit,
      page,
    },
  };
};
