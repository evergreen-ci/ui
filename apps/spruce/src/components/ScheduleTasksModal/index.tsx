import { useReducer, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Checkbox } from "@leafygreen-ui/checkbox";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { FormSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Body } from "@leafygreen-ui/typography";
import Accordion from "@evg-ui/lib/components/Accordion";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useVersionAnalytics } from "analytics";
import { TaskSchedulingWarningBanner } from "components/Banners/TaskSchedulingWarningBanner";
import {
  UndispatchedTasksQuery,
  UndispatchedTasksQueryVariables,
  ScheduleTasksMutation,
  ScheduleTasksMutationVariables,
} from "gql/generated/types";
import { SCHEDULE_TASKS } from "gql/mutations";
import { UNSCHEDULED_TASKS } from "gql/queries";
import { sumActivatedTasksInSet } from "utils/tasks/estimatedActivatedTasks";
import { initialState, reducer } from "./reducer";

interface ScheduleTasksModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  versionId: string;
}
export const ScheduleTasksModal: React.FC<ScheduleTasksModalProps> = ({
  open,
  setOpen,
  versionId,
}) => {
  const [{ allTasks, selectedTasks, sortedBuildVariantGroups }, dispatch] =
    useReducer(reducer, initialState);
  const closeModal = () => {
    dispatch({ type: "reset" });
    setOpen(false);
  };
  const dispatchToast = useToastContext();
  const { sendEvent } = useVersionAnalytics(versionId);
  const [scheduleTasks, { loading: loadingScheduleTasksMutation }] =
    useMutation<ScheduleTasksMutation, ScheduleTasksMutationVariables>(
      SCHEDULE_TASKS,
      {
        onCompleted() {
          dispatchToast.success("Successfully scheduled tasks!");
          closeModal();
        },
        onError({ message }) {
          dispatchToast.error(
            `There was an error scheduling tasks: ${message}`,
          );
          closeModal();
        },
      },
    );

  const [
    loadTaskData,
    { called: calledTaskData, data: taskData, loading: loadingTaskData },
  ] = useLazyQuery<UndispatchedTasksQuery, UndispatchedTasksQueryVariables>(
    UNSCHEDULED_TASKS,
  );

  useEffect(() => {
    if (open && !calledTaskData) {
      loadTaskData({ variables: { versionId } });
    }
  }, [calledTaskData, loadTaskData, open, versionId]);

  useEffect(() => {
    dispatch({ type: "ingestData", taskData });
  }, [taskData]);

  const { generatedTaskCounts = [] } = taskData?.version ?? {};

  const estimatedActivatedTasksCount = sumActivatedTasksInSet(
    selectedTasks,
    generatedTaskCounts,
  );

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: closeModal,
      }}
      confirmButtonProps={{
        children: "Schedule",
        disabled:
          loadingTaskData ||
          loadingScheduleTasksMutation ||
          !selectedTasks.size,
        onClick: () => {
          sendEvent({
            name: "Clicked schedule tasks button",
            "task.scheduled_count": selectedTasks.size,
          });
          scheduleTasks({
            variables: { taskIds: Array.from(selectedTasks), versionId },
          });
        },
      }}
      data-cy="schedule-tasks-modal"
      open={open}
      title="Schedule Tasks"
    >
      <TaskSchedulingWarningBanner totalTasks={estimatedActivatedTasksCount} />
      <ContentWrapper>
        {loadingTaskData ? (
          <FormSkeleton data-cy="loading-skeleton" />
        ) : (
          <>
            {sortedBuildVariantGroups.length ? (
              <Checkbox
                bold
                checked={selectedTasks.size === allTasks.length}
                data-cy="select-all-tasks"
                indeterminate={
                  selectedTasks.size > 0 && selectedTasks.size < allTasks.length
                }
                label="Select all tasks"
                name="select-all-tasks"
                onClick={() => {
                  dispatch({
                    type: "toggleSelectAll",
                  });
                }}
              />
            ) : null}
            {sortedBuildVariantGroups.map(
              ({ buildVariant, buildVariantDisplayName, tasks }) => {
                const allTasksSelected = tasks.every(({ id }) =>
                  selectedTasks.has(id),
                );
                const someTasksSelected = tasks.some(({ id }) =>
                  selectedTasks.has(id),
                );
                return (
                  <Wrapper key={buildVariant}>
                    <Accordion
                      data-cy="build-variant-accordion"
                      title={
                        <Checkbox
                          bold
                          checked={allTasksSelected}
                          data-cy={`${buildVariant}-variant-checkbox`}
                          indeterminate={!allTasksSelected && someTasksSelected}
                          label={buildVariantDisplayName}
                          name={buildVariant}
                          onClick={() => {
                            dispatch({
                              type: "toggleBuildVariant",
                              buildVariant,
                            });
                          }}
                        />
                      }
                    >
                      {tasks.map(({ displayName, id }) => (
                        <Checkbox
                          key={id}
                          bold={false}
                          checked={selectedTasks.has(id)}
                          data-cy={`${buildVariant}-${displayName}-task-checkbox`}
                          label={
                            <span data-cy="task-checkbox-label">
                              {displayName}
                            </span>
                          }
                          name={id}
                          onClick={() => {
                            dispatch({ type: "toggleTask", taskId: id });
                          }}
                        />
                      ))}
                    </Accordion>
                  </Wrapper>
                );
              },
            )}
          </>
        )}
        {!loadingTaskData && !sortedBuildVariantGroups.length && (
          <Body>There are no schedulable tasks.</Body>
        )}
      </ContentWrapper>
    </ConfirmationModal>
  );
};

// 307px represents the height to subtract to prevent an overflow on the modal
const ContentWrapper = styled.div`
  max-height: calc(100vh - 307px);
  overflow-y: auto;
`;

const Wrapper = styled.div`
  margin: ${size.xs} 0;
`;
