import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useVersionAnalytics } from "analytics";
import { Accordion } from "components/Accordion";
import { TaskSchedulingWarningBanner } from "components/Banners/TaskSchedulingWarningBanner";
import { ConfirmationModal } from "components/ConfirmationModal";
import { finishedTaskStatuses } from "constants/task";
import {
  BuildVariantsWithChildrenQuery,
  BuildVariantsWithChildrenQueryVariables,
  RestartVersionsMutation,
  RestartVersionsMutationVariables,
} from "gql/generated/types";
import { RESTART_VERSIONS } from "gql/mutations";
import { BUILD_VARIANTS_WITH_CHILDREN } from "gql/queries";
import { useVersionTaskStatusSelect } from "hooks";
import {
  versionSelectedTasks,
  selectedStrings,
} from "hooks/useVersionTaskStatusSelect";
import { sumActivatedTasksInSelectedTasks } from "utils/tasks/estimatedActivatedTasks";
import VersionTasks from "./VersionTasks";

interface VersionRestartModalProps {
  onCancel: () => void;
  onOk: () => void;
  refetchQueries: string[];
  versionId: string;
  visible: boolean;
}

const VersionRestartModal: React.FC<VersionRestartModalProps> = ({
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
  >(BUILD_VARIANTS_WITH_CHILDREN, {
    variables: {
      id: versionId,
      statuses: [...finishedTaskStatuses, TaskStatus.Aborted],
    },
    skip: !visible,
  });

  const { version } = data || {};
  const { buildVariants, childVersions } = version || {};
  const {
    baseStatusFilterTerm,
    selectedTasks,
    setBaseStatusFilterTerm,
    setVersionStatusFilterTerm,
    toggleSelectedTask,
    versionStatusFilterTerm,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
  } = useVersionTaskStatusSelect(buildVariants, versionId, childVersions);

  const setVersionStatus =
    (childVersionId: string) => (selectedFilters: string[]) => {
      setVersionStatusFilterTerm({ [childVersionId]: selectedFilters });
    };
  const setVersionBaseStatus =
    (childVersionId: string) => (selectedFilters: string[]) => {
      setBaseStatusFilterTerm({ [childVersionId]: selectedFilters });
    };

  const handlePatchRestart = () => {
    sendEvent({
      name: "Clicked restart tasks button",
      abort: shouldAbortInProgressTasks,
    });
    restartVersions({
      variables: {
        versionId,
        versionsToRestart: getTaskIds(selectedTasks),
        abort: shouldAbortInProgressTasks,
      },
    });
  };

  const selectedTotal = selectTasksTotal(selectedTasks || {});

  const { generatedTaskCounts = [] } = version ?? {};
  const estimatedActivatedTasksCount = sumActivatedTasksInSelectedTasks(
    selectedTasks || {},
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
      data-cy="version-restart-modal"
      open={visible}
      title="Modify Version"
    >
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <VersionTasks
            baseStatusFilterTerm={baseStatusFilterTerm[versionId]}
            selectedTasks={selectedTasks}
            setBaseStatusFilterTerm={setVersionBaseStatus(versionId)}
            setVersionStatusFilterTerm={setVersionStatus(versionId)}
            toggleSelectedTask={toggleSelectedTask}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            version={version}
            versionStatusFilterTerm={versionStatusFilterTerm[versionId]}
          />
          {childVersions && (
            <div data-cy="select-downstream">
              <ConfirmationMessage
                data-cy="confirmation-message"
                weight="medium"
              >
                Downstream Tasks
              </ConfirmationMessage>
              {childVersions?.map((v) => (
                <Accordion
                  key={v?.id}
                  title={<b>{v?.projectIdentifier ?? v?.project}</b>}
                >
                  <TitleContainer>
                    <VersionTasks
                      baseStatusFilterTerm={baseStatusFilterTerm[v.id]}
                      selectedTasks={selectedTasks}
                      setBaseStatusFilterTerm={setVersionBaseStatus(v?.id)}
                      setVersionStatusFilterTerm={setVersionStatus(v?.id)}
                      toggleSelectedTask={toggleSelectedTask}
                      version={v}
                      versionStatusFilterTerm={versionStatusFilterTerm[v.id]}
                    />
                  </TitleContainer>
                </Accordion>
              ))}
              <br />
            </div>
          )}
          <TaskSchedulingWarningBanner
            totalTasks={estimatedActivatedTasksCount}
          />
          <ConfirmationMessage data-cy="confirmation-message" weight="medium">
            Are you sure you want to restart the {selectedTotal} selected tasks?
          </ConfirmationMessage>
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

const selectedArray = (selected: selectedStrings) => {
  const out: string[] = [];
  Object.keys(selected).forEach((task) => {
    if (selected[task]) {
      out.push(task);
    }
  });

  return out;
};

const selectTasksTotal = (selectedTasks: versionSelectedTasks) =>
  Object.values(selectedTasks).reduce(
    (total, selectedTask) => selectedArray(selectedTask).length + total,
    0,
  );

const getTaskIds = (selectedTasks: versionSelectedTasks) =>
  Object.entries(selectedTasks)
    .map(([versionId, tasks]) => ({
      versionId,
      taskIds: selectedArray(tasks),
    }))
    .filter(({ taskIds }) => taskIds.length > 0);

const ConfirmationMessage = styled(Body)<BodyProps>`
  padding: ${size.s} 0;
`;

const TitleContainer = styled.div`
  margin-top: ${size.s};
`;

export default VersionRestartModal;
