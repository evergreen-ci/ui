import { useState } from "react";
import { skipToken, useMutation, useQuery } from "@apollo/client/react";
import { Checkbox } from "@leafygreen-ui/checkbox";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { FormSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Body } from "@leafygreen-ui/typography";
import Accordion from "@evg-ui/lib/components/Accordion";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useVersionAnalytics } from "analytics";
import { TaskSchedulingWarningBanner } from "components/Banners/TaskSchedulingWarningBanner";
import { finishedTaskStatuses } from "constants/task";
import {
  BuildVariantsWithChildrenQuery,
  BuildVariantsWithChildrenQueryVariables,
  RestartVersionsMutation,
  RestartVersionsMutationVariables,
} from "gql/generated/types";
import { RESTART_VERSIONS } from "gql/mutations";
import { BUILD_VARIANTS_WITH_CHILDREN } from "gql/queries";
import { sumActivatedTasksInSelectedTasks } from "utils/tasks/estimatedActivatedTasks";
import styles from "./index.module.css";
import { SelectedTasksMap } from "./types";
import VersionTasks from "./VersionTasks";

interface VersionRestartModalProps {
  onCancel: () => void;
  onOk: () => void;
  refetchQueries: string[];
  versionId: string;
  visible: boolean;
}

export const VersionRestartModal: React.FC<VersionRestartModalProps> = ({
  onCancel,
  onOk,
  refetchQueries,
  versionId,
  visible,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useVersionAnalytics(versionId);

  const [shouldAbortInProgressTasks, setShouldAbortInProgressTasks] =
    useState(false);
  const [selectedTasksMap, setSelectedTasksMap] = useState<SelectedTasksMap>(
    new Map(),
  );

  const [restartVersions, { loading: mutationLoading }] = useMutation<
    RestartVersionsMutation,
    RestartVersionsMutationVariables
  >(RESTART_VERSIONS, {
    onCompleted: () => {
      onOk();
      dispatchToast.success(`Successfully restarted tasks!`);
    },
    onError: (err) => {
      onOk();
      dispatchToast.error(`Error while restarting tasks: '${err.message}'`);
    },
    refetchQueries,
  });

  const { data, loading } = useQuery<
    BuildVariantsWithChildrenQuery,
    BuildVariantsWithChildrenQueryVariables
  >(
    BUILD_VARIANTS_WITH_CHILDREN,
    visible
      ? {
          variables: {
            id: versionId,
            statuses: [...finishedTaskStatuses, TaskStatus.Aborted],
          },
        }
      : skipToken,
  );

  const { version } = data || {};
  const { childVersions } = version || {};

  const selectedTotal = selectedTasksMap
    .values()
    .reduce((acc, set) => acc + set.size, 0);

  const handlePatchRestart = () => {
    sendEvent({
      name: "Clicked restart tasks button",
      abort: shouldAbortInProgressTasks,
      "task.modified_count": selectedTotal,
    });
    restartVersions({
      variables: {
        versionId,
        versionsToRestart: getTaskIds(selectedTasksMap),
        abort: shouldAbortInProgressTasks,
      },
    });
  };
  const { generatedTaskCounts = [] } = version ?? {};
  const estimatedActivatedTasksCount = sumActivatedTasksInSelectedTasks(
    Array.from(selectedTasksMap.values()),
    generatedTaskCounts,
  );

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: onCancel,
      }}
      confirmButtonProps={{
        children: "Restart",
        disabled: selectedTotal === 0 || mutationLoading,
        onClick: handlePatchRestart,
      }}
      data-testid="version-restart-modal"
      open={visible}
      title="Modify Version"
    >
      <TaskSchedulingWarningBanner totalTasks={estimatedActivatedTasksCount} />
      {!version || loading ? (
        <FormSkeleton />
      ) : (
        <>
          <VersionTasks
            setSelectedTasksMap={setSelectedTasksMap}
            version={version}
          />
          {childVersions && (
            <div data-testid="select-downstream">
              <Body
                className={styles.confirmationMessage}
                data-testid="confirmation-message"
                weight="medium"
              >
                Downstream Tasks
              </Body>
              {childVersions?.map((v) => (
                <Accordion
                  key={v?.id}
                  title={<b>{v?.projectMetadata?.identifier}</b>}
                >
                  <div className={styles.downstreamTasksContainer}>
                    <VersionTasks
                      setSelectedTasksMap={setSelectedTasksMap}
                      version={v}
                    />
                  </div>
                </Accordion>
              ))}
              <br />
            </div>
          )}
          <Body
            className={styles.confirmationMessage}
            data-testid="confirmation-message"
            weight="medium"
          >
            Are you sure you want to restart the {selectedTotal} selected tasks?
          </Body>
          <Checkbox
            bold={false}
            checked={shouldAbortInProgressTasks}
            label="Abort in progress tasks"
            onChange={() =>
              setShouldAbortInProgressTasks(!shouldAbortInProgressTasks)
            }
          />
        </>
      )}
    </ConfirmationModal>
  );
};

const getTaskIds = (selectedTasks: SelectedTasksMap) =>
  Array.from(selectedTasks.entries())
    .map(([versionId, tasks]) => ({
      versionId,
      taskIds: Array.from(tasks),
    }))
    .filter(({ taskIds }) => taskIds.length > 0);
