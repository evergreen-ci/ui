import { useEffect, useReducer } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import {
  AlertDialog,
  Body,
  Button,
  Checkbox,
  Content,
  DialogRoot,
  Footer,
  Header,
  Text,
} from "@via-ds/components";
import { Skeleton } from "@via-ds/components/skeleton";
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
    setOpen(false);
    dispatch({ type: "reset" });
  };
  const dispatchToast = useToastContext();
  const { sendEvent } = useVersionAnalytics(versionId);
  const [scheduleTasks, { loading: loadingScheduleTasksMutation }] =
    useMutation<ScheduleTasksMutation, ScheduleTasksMutationVariables>(
      SCHEDULE_TASKS,
      {
        onCompleted() {
          closeModal();
          dispatchToast.success("Tasks scheduled");
        },
        onError(err) {
          closeModal();
          dispatchToast.error(err.message);
        },
        refetchQueries: ["Version"],
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
    <DialogRoot
      isOpen={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) closeModal();
      }}
    >
      <AlertDialog data-testid="schedule-tasks-modal">
        <Header>
          <Text slot="title">Schedule Tasks</Text>
        </Header>
        <Content>
          <TaskSchedulingWarningBanner
            totalTasks={estimatedActivatedTasksCount}
          />
          <div className={styles.contentWrapper}>
            <Skeleton isLoading={loadingTaskData}>
              {loadingTaskData ? (
                // Skeleton will shimmer children when loading
                <div data-testid="loading-skeleton" />
              ) : (
                <>
                  {sortedBuildVariantGroups.length ? (
                    <Checkbox
                      data-testid="select-all-tasks"
                      isIndeterminate={
                        selectedTasks.size > 0 &&
                        selectedTasks.size < allTasks.length
                      }
                      isSelected={selectedTasks.size === allTasks.length}
                      onChange={() => {
                        dispatch({
                          type: "toggleSelectAll",
                        });
                      }}
                    >
                      Select all tasks
                    </Checkbox>
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
                                data-testid={`${buildVariant}-variant-checkbox`}
                                isIndeterminate={
                                  !allTasksSelected && someTasksSelected
                                }
                                isSelected={allTasksSelected}
                                onChange={() => {
                                  dispatch({
                                    type: "toggleBuildVariant",
                                    buildVariant,
                                  });
                                }}
                              >
                                {buildVariantDisplayName}
                              </Checkbox>
                            }
                          >
                            {tasks.map(({ displayName, id }) => (
                              <Checkbox
                                key={id}
                                data-testid={`${buildVariant}-${displayName}-task-checkbox`}
                                isSelected={selectedTasks.has(id)}
                                onChange={() => {
                                  dispatch({
                                    type: "toggleTask",
                                    taskId: id,
                                  });
                                }}
                              >
                                <span data-testid="task-checkbox-label">
                                  {displayName}
                                </span>
                              </Checkbox>
                            ))}
                          </Accordion>
                        </div>
                      );
                    },
                  )}
                </>
              )}
            </Skeleton>
            {!loadingTaskData && !sortedBuildVariantGroups.length && (
              <Body>There are no schedulable tasks.</Body>
            )}
          </div>
        </Content>
        <Footer>
          <Button onPress={closeModal} slot="cancel">
            Cancel
          </Button>
          <Button
            isDisabled={
              loadingTaskData ||
              loadingScheduleTasksMutation ||
              !selectedTasks.size
            }
            onPress={() => {
              sendEvent({
                name: "Clicked schedule tasks button",
                "task.scheduled_count": selectedTasks.size,
              });
              scheduleTasks({
                variables: {
                  taskIds: Array.from(selectedTasks),
                  versionId,
                },
              });
            }}
            slot="action"
          >
            Schedule
          </Button>
        </Footer>
      </AlertDialog>
    </DialogRoot>
  );
};
