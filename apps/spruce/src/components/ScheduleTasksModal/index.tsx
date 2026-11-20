import { useEffect, useReducer } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import {
  Body,
  Button,
  Checkbox,
  Content,
  Dialog,
  DialogRoot,
  Footer,
  Header,
  Skeleton,
  Text,
} from "@via-ds/components";
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
    <DialogRoot
      isOpen={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          closeModal();
        }
      }}
    >
      <Dialog data-testid="schedule-tasks-modal">
        <Header>
          <Text slot="title">Schedule Tasks</Text>
        </Header>
        <Content>
          <TaskSchedulingWarningBanner
            totalTasks={estimatedActivatedTasksCount}
          />
          <div className={styles.contentWrapper}>
            {loadingTaskData ? (
              <Skeleton isLoading>
                <div data-testid="loading-skeleton">
                  {Array.from({ length: 3 }, (_, index) => (
                    <Text key={index}>Placeholder build variant name</Text>
                  ))}
                </div>
              </Skeleton>
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
                    name="select-all-tasks"
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
                              name={buildVariant}
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
                              name={id}
                              onChange={() => {
                                dispatch({ type: "toggleTask", taskId: id });
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
            {!loadingTaskData && !sortedBuildVariantGroups.length && (
              <Body>There are no schedulable tasks.</Body>
            )}
          </div>
        </Content>
        <Footer>
          <Button slot="cancel">Cancel</Button>
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
                variables: { taskIds: Array.from(selectedTasks), versionId },
              });
            }}
            variant="primary"
          >
            Schedule
          </Button>
        </Footer>
      </Dialog>
    </DialogRoot>
  );
};
