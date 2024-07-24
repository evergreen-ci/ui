import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { useVersionAnalytics } from "analytics";
import { Accordion } from "components/Accordion";
import { ConfirmationModal } from "components/ConfirmationModal";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
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
import VersionTasks from "./VersionTasks";

interface VersionRestartModalProps {
  onCancel: () => void;
  onOk: () => void;
  refetchQueries: string[];
  versionId?: string;
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
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: versionId },
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

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { sendEvent } = useVersionAnalytics(versionId);

  const handlePatchRestart = () => {
    sendEvent({
      name: "Clicked restart tasks button",
      abort: shouldAbortInProgressTasks,
    });
    restartVersions({
      variables: {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        versionId: version?.id,
        versionsToRestart: getTaskIds(selectedTasks),
        abort: shouldAbortInProgressTasks,
      },
    });
  };

  const selectedTotal = selectTasksTotal(selectedTasks || {});

  return (
    <ConfirmationModal
      title="Modify Version"
      open={visible}
      onConfirm={handlePatchRestart}
      onCancel={onCancel}
      buttonText="Restart"
      submitDisabled={selectedTotal === 0 || mutationLoading}
      data-cy="version-restart-modal"
    >
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <VersionTasks
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            version={version}
            selectedTasks={selectedTasks}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            setBaseStatusFilterTerm={setVersionBaseStatus(version?.id)}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            setVersionStatusFilterTerm={setVersionStatus(version?.id)}
            toggleSelectedTask={toggleSelectedTask}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            baseStatusFilterTerm={baseStatusFilterTerm[version?.id]}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            versionStatusFilterTerm={versionStatusFilterTerm[version?.id]}
          />
          {childVersions && (
            <div data-cy="select-downstream">
              <ConfirmationMessage
                weight="medium"
                data-cy="confirmation-message"
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
                      version={v}
                      selectedTasks={selectedTasks}
                      setBaseStatusFilterTerm={setVersionBaseStatus(v?.id)}
                      setVersionStatusFilterTerm={setVersionStatus(v?.id)}
                      toggleSelectedTask={toggleSelectedTask}
                      baseStatusFilterTerm={baseStatusFilterTerm[v.id]}
                      versionStatusFilterTerm={versionStatusFilterTerm[v.id]}
                    />
                  </TitleContainer>
                </Accordion>
              ))}
              <br />
            </div>
          )}

          <ConfirmationMessage weight="medium" data-cy="confirmation-message">
            Are you sure you want to restart the {selectedTotal} selected tasks?
          </ConfirmationMessage>
          <Checkbox
            onChange={() =>
              setShouldAbortInProgressTasks(!shouldAbortInProgressTasks)
            }
            label="Abort in progress tasks"
            checked={shouldAbortInProgressTasks}
            bold={false}
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
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    (total, selectedTask) => selectedArray(selectedTask).length + total,
    0,
  );

const getTaskIds = (selectedTasks: versionSelectedTasks) =>
  Object.entries(selectedTasks)
    .map(([versionId, tasks]) => ({
      versionId,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
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
