import { useMutation, useQuery } from "@apollo/client/react";
import { MenuItem } from "@leafygreen-ui/menu";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useVersionAnalytics } from "analytics";
import { finishedTaskStatuses } from "constants/task";
import {
  BuildVariantsWithChildrenQuery,
  BuildVariantsWithChildrenQueryVariables,
  RestartVersionsMutation,
  RestartVersionsMutationVariables,
} from "gql/generated/types";
import { RESTART_VERSIONS } from "gql/mutations";
import { BUILD_VARIANTS_WITH_CHILDREN } from "gql/queries";

interface RestartFailedTasksProps {
  disabled?: boolean;
  patchId: string;
  refetchQueries: string[];
}

export const RestartFailedTasks: React.FC<RestartFailedTasksProps> = ({
  disabled = false,
  patchId,
  refetchQueries,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useVersionAnalytics(patchId);

  const [restartVersions, { loading: mutationLoading }] = useMutation<
    RestartVersionsMutation,
    RestartVersionsMutationVariables
  >(RESTART_VERSIONS, {
    onCompleted: () => {
      dispatchToast.success(`Successfully restarted tasks!`);
    },
    onError: (err) => {
      dispatchToast.error(`Error while restarting tasks: '${err.message}'`);
    },
    refetchQueries,
  });

  const { data, loading: queryLoading } = useQuery<
    BuildVariantsWithChildrenQuery,
    BuildVariantsWithChildrenQueryVariables
  >(BUILD_VARIANTS_WITH_CHILDREN, {
    variables: {
      id: patchId,
      statuses: [...finishedTaskStatuses, TaskStatus.Aborted],
    },
  });

  const handleRestartFailedTasks = () => {
    const { version } = data || {};
    const { buildVariants, childVersions } = version || {};

    const collectFailedTasks = (
      variants: BuildVariantsWithChildrenQuery["version"]["buildVariants"],
    ) => {
      const taskIds: string[] = [];
      variants?.forEach((bv) => {
        bv.tasks?.forEach((task) => {
          if (
            task.displayStatus === TaskStatus.Failed ||
            task.displayStatus === TaskStatus.TaskTimedOut ||
            task.displayStatus === TaskStatus.TestTimedOut ||
            task.displayStatus === TaskStatus.KnownIssue ||
            task.displayStatus === TaskStatus.SetupFailed ||
            task.displayStatus === TaskStatus.SystemFailed ||
            task.displayStatus === TaskStatus.SystemTimedOut ||
            task.displayStatus === TaskStatus.SystemUnresponsive
          ) {
            taskIds.push(task.id);
          }
        });
      });
      return taskIds;
    };

    const versionsToRestart = [];

    // Collect failed tasks from main version
    const mainVersionTaskIds = collectFailedTasks(buildVariants);
    if (mainVersionTaskIds.length > 0) {
      versionsToRestart.push({
        versionId: patchId,
        taskIds: mainVersionTaskIds,
      });
    }

    // Collect failed tasks from child versions
    childVersions?.forEach((childVersion) => {
      const childTaskIds = collectFailedTasks(childVersion.buildVariants);
      if (childTaskIds.length > 0) {
        versionsToRestart.push({
          versionId: childVersion.id,
          taskIds: childTaskIds,
        });
      }
    });

    const totalFailedTasks = versionsToRestart.reduce(
      (sum, v) => sum + v.taskIds.length,
      0,
    );

    if (totalFailedTasks === 0) {
      dispatchToast.warning("No failed tasks to restart.");
      return;
    }

    sendEvent({
      name: "Clicked restart failed tasks button",
      abort: false,
      "task.modified_count": totalFailedTasks,
    });

    restartVersions({
      variables: {
        versionId: patchId,
        versionsToRestart,
        abort: false,
      },
    });
  };

  return (
    <MenuItem
      data-cy="restart-failed-tasks"
      disabled={disabled || queryLoading || mutationLoading}
      onClick={handleRestartFailedTasks}
    >
      Restart failed tasks
    </MenuItem>
  );
};
