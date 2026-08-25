import { useEffect, useReducer } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { Checkbox } from "@leafygreen-ui/checkbox";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { FormSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Body } from "@leafygreen-ui/typography";
import Accordion from "@evg-ui/lib/components/Accordion";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useVersionAnalytics } from "analytics";
import { TaskSchedulingWarningBanner } from "components/Banners/TaskSchedulingWarningBanner";
import {
  ScheduleTasksMutation,
  ScheduleTasksMutationVariables,
  UndispatchedTasksQuery,
  UndispatchedTasksQueryVariables,
} from "gql/generated/types";
import { SCHEDULE_TASKS } from "gql/mutations";
import { UNSCHEDULED_TASKS } from "gql/queries";
import { sumActivatedTasksInSet } from "utils/tasks/estimatedActivatedTasks";
import styles from "./index.module.css";
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
      data-testid="schedule-tasks-modal"
      open={open}
      title="Schedule Tasks"
    >
      <TaskSchedulingWarningBanner totalTasks={estimatedActivatedTasksCount} />
      <div className={styles.contentWrapper}>
        {loadingTaskData ? (
          <FormSkeleton data-testid="loading-skeleton" />
        ) : (
          <>
            {sortedBuildVariantGroups.length ? (
              <Checkbox
                bold
                checked={selectedTasks.size === allTasks.length}
                data-testid="select-all-tasks"
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
                  <div key={buildVariant} className={styles.wrapper}>
                    <Accordion
                      data-testid="build-variant-accordion"
                      title={
                        <Checkbox
                          bold
                          checked={allTasksSelected}
                          data-testid={`${buildVariant}-variant-checkbox`}
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
                          data-testid={`${buildVariant}-${displayName}-task-checkbox`}
                          label={
                            <span data-testid="task-checkbox-label">
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
                  </div>
                );
              },
            )}
          </>
        )}
        {!loadingTaskData && !sortedBuildVariantGroups.length && (
          <Body>There are no schedulable tasks.</Body>
        )}
      </div>
    </ConfirmationModal>
  );
};
