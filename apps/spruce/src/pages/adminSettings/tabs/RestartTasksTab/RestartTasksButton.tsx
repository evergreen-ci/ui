import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant as ButtonVariant } from "@leafygreen-ui/button";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Spinner } from "@leafygreen-ui/loading-indicator/spinner";
import { Description } from "@leafygreen-ui/typography";
import { toZonedTime } from "date-fns-tz";
import { StyledRouterLink, wordBreakCss } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { getTaskRoute } from "constants/routes";
import { utcTimeZone } from "constants/time";
import {
  AdminTasksToRestartQuery,
  AdminTasksToRestartQueryVariables,
  RestartAdminTasksMutation,
  RestartAdminTasksMutationVariables,
  RestartAdminTasksOptions,
} from "gql/generated/types";
import { RESTART_ADMIN_TASKS } from "gql/mutations";
import { ADMIN_TASKS_TO_RESTART } from "gql/queries";
import { RestartTasksFormState } from "./types";

interface RestartTasksModalProps {
  handleClose: () => void;
  open: boolean;
  restartOpts: RestartAdminTasksOptions;
}

const RestartTasksModal: React.FC<RestartTasksModalProps> = ({
  handleClose,
  open,
  restartOpts,
}) => {
  const dispatchToast = useToastContext();

  const { data, loading } = useQuery<
    AdminTasksToRestartQuery,
    AdminTasksToRestartQueryVariables
  >(ADMIN_TASKS_TO_RESTART, {
    skip: !open,
    variables: { opts: restartOpts },
  });
  const { adminTasksToRestart } = data ?? {};
  const { tasksToRestart } = adminTasksToRestart ?? {};

  const [restartAdminTasks] = useMutation<
    RestartAdminTasksMutation,
    RestartAdminTasksMutationVariables
  >(RESTART_ADMIN_TASKS, {
    onCompleted: (res) => {
      dispatchToast.success(
        `Created job to restart ${res.restartAdminTasks.numRestartedTasks} tasks.`,
      );
    },
    onError: (err) => {
      dispatchToast.success(`Failed to schedule job: ${err}`);
    },
  });

  const onConfirm = () => {
    restartAdminTasks({ variables: { opts: restartOpts } });
    handleClose();
  };

  const hasTasksToRestart = tasksToRestart && tasksToRestart.length > 0;

  return (
    <ConfirmationModal
      cancelButtonProps={{ onClick: handleClose }}
      confirmButtonProps={{
        children: "Confirm",
        disabled: !hasTasksToRestart,
        onClick: onConfirm,
      }}
      data-cy="restart-tasks-modal"
      open={open}
      title="Submit Restart Tasks"
    >
      {loading ? (
        <LoadingIndicatorContainer>
          <Spinner size="large" />
          <Description>Loading…</Description>
        </LoadingIndicatorContainer>
      ) : (
        <div>
          {hasTasksToRestart ? (
            <>
              <Description>
                The following {tasksToRestart.length} tasks will be restarted:
              </Description>
              <ul data-cy="restart-tasks-list">
                {tasksToRestart.map((t) => (
                  <li key={t.id}>
                    <TaskLink to={getTaskRoute(t.id)}>{t.id}</TaskLink>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            "No tasks found."
          )}
        </div>
      )}
    </ConfirmationModal>
  );
};

const LoadingIndicatorContainer = styled.div`
  margin: ${size.m} auto 0 auto;
  text-align: center;
`;

const TaskLink = styled(StyledRouterLink)`
  ${wordBreakCss};
`;

interface RestartTasksButtonProps {
  disabled: boolean;
  formState: RestartTasksFormState;
}

export const RestartTasksButton: React.FC<RestartTasksButtonProps> = ({
  disabled,
  formState,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const endTime = calculateTargetTime(
    formState.end.endDate,
    formState.end.endTime,
  );
  const startTime = calculateTargetTime(
    formState.start.startDate,
    formState.start.startTime,
  );
  const restartOpts: RestartAdminTasksOptions = {
    endTime,
    includeSetupFailed: formState.includeTasks.includeSetupFailed,
    includeSystemFailed: formState.includeTasks.includeSystemFailed,
    includeTestFailed: formState.includeTasks.includeTestFailed,
    startTime,
  };

  return (
    <>
      <RestartTasksModal
        handleClose={() => setModalOpen(false)}
        open={modalOpen}
        restartOpts={restartOpts}
      />
      <Button
        data-cy="restart-tasks-button"
        disabled={disabled}
        onClick={() => setModalOpen(true)}
        variant={ButtonVariant.Primary}
      >
        Preview Restart Tasks
      </Button>
    </>
  );
};

const calculateTargetTime = (date: string, time: string) => {
  const localDate = new Date(date);

  // Dates don't store timezone information so we should convert
  // to UTC before sending to backend.
  const targetDate = toZonedTime(localDate, utcTimeZone);
  const targetTime = new Date(time);
  targetDate.setHours(targetTime.getHours());
  targetDate.setMinutes(targetTime.getMinutes());
  return targetDate;
};
