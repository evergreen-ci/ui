import { usePagination } from "@evg-ui/lib/hooks";
import { TableQueryParams } from "constants/queryParams";
import {
  VersionTasksQueryVariables,
  SortOrder,
  TaskSortCategory,
} from "gql/generated/types";
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
    [PatchTasksQueryParams.IncludeNeverActivatedTasks]:
      includeNeverActivatedTasks,
  } = queryParams;

  const sortsToApply: SortOrder[] = sorts
    ? parseSortString<"Key", "Direction", TaskSortCategory, SortOrder>(sorts, {
        sortByKey: "Key",
        sortDirKey: "Direction",
        sortCategoryEnum: TaskSortCategory,
      })
    : [];

  const isIncludeNeverActivatedTasksDefined =
    includeNeverActivatedTasks !== undefined;
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
      includeNeverActivatedTasks: isIncludeNeverActivatedTasksDefined
        ? includeNeverActivatedTasks === "true"
        : undefined,
    },
  };
};
