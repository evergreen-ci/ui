import {
  VersionTasksQueryVariables,
  SortOrder,
  TaskSortCategory,
  SortDirection,
} from "gql/generated/types";
import usePagination from "hooks/usePagination";
import { useQueryParams } from "hooks/useQueryParam";
import { PatchTasksQueryParams } from "types/task";
import { queryString } from "utils";

const { parseSortString } = queryString;

/**
 * `useVersionTasksQueryVariables` generates the variables required for the VersionTasksQuery.
 * It uses the versionId provided, and extracts other necessary parameters from the query string.
 * These parameters include pagination data, sorting options, and various task filter options.
 * @param versionId - The ID of the version to get tasks for.
 * @returns An object containing the variables for the VersionTasksQuery.
 */
const useVersionTasksQueryVariables = (versionId: string) => {
  const { limit, page } = usePagination();
  const [queryParams] = useQueryParams();
  const {
    [PatchTasksQueryParams.Duration]: duration,
    [PatchTasksQueryParams.Sorts]: sorts,
    [PatchTasksQueryParams.Variant]: variant,
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Statuses]: statuses,
    [PatchTasksQueryParams.BaseStatuses]: baseStatuses,
  } = queryParams;

  let sortsToApply: SortOrder[];
  if (typeof sorts === "string") {
    sortsToApply = parseSortString(sorts, "Key").map(({ Key, direction }) => ({
      Key,
      Direction: direction,
    }));
  }
  if (typeof duration === "string") {
    sortsToApply = [
      { Key: TaskSortCategory.Duration, Direction: duration as SortDirection },
    ];
  }
  let statusesToApply: string[] = [];
  if (Array.isArray(statuses)) {
    statusesToApply = statuses.map((status) => status.toString());
  } else {
    statusesToApply.push((statuses || "").toString());
  }
  let baseStatusesToApply: string[] = [];
  if (Array.isArray(baseStatuses)) {
    baseStatusesToApply = baseStatuses.map((status) => status.toString());
  } else {
    baseStatusesToApply.push((baseStatuses || "").toString());
  }
  return {
    versionId,
    taskFilterOptions: {
      variant: typeof variant === "string" ? variant : "",
      taskName: typeof taskName === "string" ? taskName : "",
      statuses: statusesToApply,
      baseStatuses: baseStatusesToApply,
      sorts: sortsToApply,
      limit,
      page,
    },
  } satisfies VersionTasksQueryVariables;
};

export default useVersionTasksQueryVariables;
