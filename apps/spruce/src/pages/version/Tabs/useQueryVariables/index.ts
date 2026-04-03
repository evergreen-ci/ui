import Cookies from "js-cookie";
import { useQueryParam } from "@evg-ui/lib/hooks";
import usePagination from "@evg-ui/lib/src/hooks/usePagination";
import { INCLUDE_NEVER_ACTIVATED_TASKS } from "constants/cookies";
import { TableQueryParams } from "constants/queryParams";
import {
  VersionTasksQueryVariables,
  SortOrder,
  TaskSortCategory,
} from "gql/generated/types";
import { PatchTasksQueryParams } from "types/task";
import { parseSortString } from "utils/queryString";

export const useQueryVariables = (
  versionId: string,
): VersionTasksQueryVariables => {
  const { limit, page } = usePagination();

  const [sorts] = useQueryParam<string | string[] | undefined>(
    TableQueryParams.Sorts,
    undefined,
  );
  const [variant] = useQueryParam<string>(PatchTasksQueryParams.Variant, "");
  const [taskName] = useQueryParam<string>(PatchTasksQueryParams.TaskName, "");
  const [statuses] = useQueryParam<string[]>(
    PatchTasksQueryParams.Statuses,
    [],
  );
  const [baseStatuses] = useQueryParam<string[]>(
    PatchTasksQueryParams.BaseStatuses,
    [],
  );
  const [includeNeverActivatedTasksParam] = useQueryParam<string | undefined>(
    PatchTasksQueryParams.IncludeNeverActivatedTasks,
    undefined,
  );

  let includeNeverActivatedTasks: boolean | undefined;
  if (includeNeverActivatedTasksParam !== undefined) {
    includeNeverActivatedTasks = includeNeverActivatedTasksParam === "true";
  } else if (Cookies.get(INCLUDE_NEVER_ACTIVATED_TASKS) === "true") {
    includeNeverActivatedTasks = true;
  }

  const sortsToApply: SortOrder[] = sorts
    ? parseSortString<"Key", "Direction", TaskSortCategory, SortOrder>(sorts, {
        sortByKey: "Key",
        sortDirKey: "Direction",
        sortCategoryEnum: TaskSortCategory,
      })
    : [];

  return {
    versionId,
    taskFilterOptions: {
      variant,
      taskName,
      statuses,
      baseStatuses,
      sorts: sortsToApply,
      limit,
      page,
      includeNeverActivatedTasks,
    },
  };
};
