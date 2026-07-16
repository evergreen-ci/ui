import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { TreeDataEntry } from "@evg-ui/lib/components/TreeSelect";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { taskStatusesFilterTreeData } from "constants/task";
import {
  TaskStatusesQuery,
  TaskStatusesQueryVariables,
} from "gql/generated/types";
import { TASK_STATUSES } from "gql/queries";
import { usePolling } from "hooks";
import { getCurrentStatuses } from "utils/statuses";

interface UseTaskStatusesProps {
  versionId: string;
}

interface UseTaskStatusesResult {
  currentStatuses: TreeDataEntry[];
  baseStatuses: TreeDataEntry[];
}

export const useTaskStatuses = ({
  versionId,
}: UseTaskStatusesProps): UseTaskStatusesResult => {
  const { data, refetch, startPolling, stopPolling } = useQuery<
    TaskStatusesQuery,
    TaskStatusesQueryVariables
  >(TASK_STATUSES, {
    pollInterval: DEFAULT_POLL_INTERVAL,
    variables: { id: versionId },
  });

  usePolling<TaskStatusesQuery, TaskStatusesQueryVariables>({
    refetch,
    startPolling,
    stopPolling,
  });

  const { version } = data || {};
  const { baseVersion, taskStatuses } = version || {};
  const currentStatuses = useMemo(
    () => getCurrentStatuses(taskStatuses ?? [], taskStatusesFilterTreeData),
    [taskStatuses],
  );
  const baseStatuses = useMemo(() => {
    // Only include statuses that appear in both the base version and the current version
    const baseTaskStatuses = baseVersion?.taskStatuses.filter((s) =>
      taskStatuses?.includes(s),
    );
    return getCurrentStatuses(
      baseTaskStatuses ?? [],
      taskStatusesFilterTreeData,
    );
  }, [baseVersion?.taskStatuses, taskStatuses]);

  return { baseStatuses, currentStatuses };
};
