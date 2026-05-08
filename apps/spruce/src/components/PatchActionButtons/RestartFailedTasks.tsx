import { forwardRef } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
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
import { isFailedTaskStatus } from "utils/statuses";

interface RestartFailedTasksProps {
  disabled?: boolean;
  patchId: string;
  refetchQueries: string[];
}

export const RestartFailedTasks = forwardRef<
  HTMLButtonElement,
  RestartFailedTasksProps
>(({ disabled = false, patchId, refetchQueries }, ref) => {
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

  const [fetchBuildVariants, { loading: queryLoading }] = useLazyQuery<
    BuildVariantsWithChildrenQuery,
    BuildVariantsWithChildrenQueryVariables
  >(BUILD_VARIANTS_WITH_CHILDREN, {
    fetchPolicy: "network-only",
  });

  const handleRestartFailedTasks = async () => {
    let data: BuildVariantsWithChildrenQuery | undefined;
    try {
      const result = await fetchBuildVariants({
        variables: {
          id: patchId,
          statuses: [...finishedTaskStatuses, TaskStatus.Aborted],
        },
      });
      data = result.data;
      if (result.error) {
        dispatchToast.error(`Error loading task data: ${result.error.message}`);
        return;
      }
    } catch (err) {
      dispatchToast.error(
        `Error loading task data: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      return;
    }

    const { version } = data || {};
    const { buildVariants, childVersions } = version || {};

    const collectFailedTasks = (
      variants: BuildVariantsWithChildrenQuery["version"]["buildVariants"],
    ) => {
      const taskIds: string[] = [];
      variants?.forEach((bv) => {
        bv.tasks?.forEach((task) => {
          if (isFailedTaskStatus(task.displayStatus)) {
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
      ref={ref}
      data-cy="restart-failed-tasks"
      disabled={disabled || queryLoading || mutationLoading}
      onClick={handleRestartFailedTasks}
    >
      Restart failed tasks
    </MenuItem>
  );
});

RestartFailedTasks.displayName = "MenuItem";
