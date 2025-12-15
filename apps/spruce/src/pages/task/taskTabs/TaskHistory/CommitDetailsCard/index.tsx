import { forwardRef } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Badge, Variant as BadgeVariant } from "@leafygreen-ui/badge";
import Button, { Size as ButtonSize } from "@leafygreen-ui/button";
import { Chip, Variant as ChipVariant } from "@leafygreen-ui/chip";
import { IconButton } from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { InlineCode } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import Accordion, {
  AccordionCaretAlign,
} from "@evg-ui/lib/components/Accordion";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { useTaskHistoryAnalytics } from "analytics";
import SetPriority, { Align } from "components/SetPriority";
import { inactiveElementStyle } from "components/styles";
import { statusColorMap } from "components/TaskBox";
import { getGithubCommitUrl } from "constants/externalResources";
import { getTaskRoute } from "constants/routes";
import {
  RestartTaskMutation,
  RestartTaskMutationVariables,
  ScheduleTasksMutation,
  ScheduleTasksMutationVariables,
} from "gql/generated/types";
import { RESTART_TASK, SCHEDULE_TASKS } from "gql/mutations";
import { useDateFormat } from "hooks";
import { NotifyMeButton } from "pages/task/ActionButtons/NotifyMeButton";
import { RequiredQueryParams, TaskTab } from "types/task";
import { isProduction } from "utils/environmentVariables";
import {
  stickyHeaderScrollOffset,
  walkthroughCommitCardProps,
} from "../constants";
import { useTaskHistoryContext } from "../context";
import { TaskHistoryTask } from "../types";
import CommitDescription from "./CommitDescription";
import FailedTestsTable from "./FailedTestsTable";

const { blue, gray } = palette;

interface CommitDetailsCardProps {
  isMatching: boolean;
  task: TaskHistoryTask;
}

const CommitDetailsCard = forwardRef<HTMLDivElement, CommitDetailsCardProps>(
  ({ isMatching, task }, ref) => {
    const { sendEvent } = useTaskHistoryAnalytics();
    const dispatchToast = useToastContext();
    const getDateCopy = useDateFormat();

    const {
      baseTaskId,
      currentTask,
      expandedTasksMap,
      isPatch,
      selectedTask,
      setExpandedTasksMap,
      setHoveredTask,
    } = useTaskHistoryContext();
    const [, setExecution] = useQueryParam(RequiredQueryParams.Execution, 0);

    const {
      activated,
      canRestart,
      canSchedule,
      canSetPriority,
      createTime,
      displayStatus,
      id: taskId,
      latestExecution,
      order,
      priority,
      revision,
      tests,
      versionMetadata,
    } = task;
    const { author, id: versionId, message } = versionMetadata;

    const owner = currentTask.project?.owner ?? "";
    const repo = currentTask.project?.repo ?? "";
    const isCurrentTask = isPatch
      ? taskId === baseTaskId
      : taskId === currentTask.id;
    const isSelectedTask = taskId === selectedTask;

    const createDate = new Date(createTime ?? "");
    const dateCopy = getDateCopy(createDate, {
      omitSeconds: true,
      omitTimezone: true,
    });

    const githubCommitUrl =
      owner && repo && revision
        ? getGithubCommitUrl(owner, repo, revision)
        : "";

    const [scheduleTask] = useMutation<
      ScheduleTasksMutation,
      ScheduleTasksMutationVariables
    >(SCHEDULE_TASKS, {
      variables: { taskIds: [taskId], versionId },
      onCompleted: () => {
        const newMap = new Map(expandedTasksMap);
        newMap.delete(task.id);
        setExpandedTasksMap(newMap);
        dispatchToast.success("Task scheduled to run");
      },
      onError: (err) => {
        dispatchToast.error(`Error scheduling task: ${err.message}`);
      },
      update: (cache) => {
        cache.modify({
          id: cache.identify(task),
          fields: {
            canSchedule: () => false,
            canSetPriority: () => true,
            displayStatus: () => TaskStatus.WillRun,
            activated: () => true,
          },
          broadcast: true,
        });
      },
    });

    const [restartTask] = useMutation<
      RestartTaskMutation,
      RestartTaskMutationVariables
    >(RESTART_TASK, {
      variables: { taskId, failedOnly: false },
      onCompleted: (data) => {
        dispatchToast.success("Task scheduled to restart");
        if (isCurrentTask) {
          const newerExecution = data?.restartTask.latestExecution ?? 0;
          setExecution(newerExecution);
        }
      },
      onError: (err) =>
        dispatchToast.error(`Error restarting task: ${err.message}`),
      update: (cache) => {
        if (!isCurrentTask) {
          cache.modify({
            id: cache.identify(task),
            fields: {
              canRestart: () => false,
              canSetPriority: () => true,
              displayStatus: () => TaskStatus.WillRun,
              execution: (cachedExecution: number) => cachedExecution + 1,
              latestExecution: (cachedExecution: number) => cachedExecution + 1,
            },
            broadcast: false,
          });
        }
      },
      // Only re-request if the current task is restarted. This should be relatively
      // uncommon.
      refetchQueries: [isCurrentTask ? "TaskHistory" : ""],
    });

    return (
      <CommitCard
        key={taskId}
        ref={ref}
        data-cy="commit-details-card"
        id={`commit-card-${taskId}`}
        isMatching={isMatching}
        onMouseEnter={() => setHoveredTask(taskId)}
        onMouseLeave={() => setHoveredTask(null)}
        selected={isSelectedTask}
        status={displayStatus as TaskStatus}
        {...walkthroughCommitCardProps}
      >
        <TopLabel>
          <InlineCode
            as={Link}
            data-cy="task-link"
            onClick={() =>
              sendEvent({
                name: "Clicked task link",
                "task.id": taskId,
              })
            }
            to={getTaskRoute(taskId, { tab: TaskTab.History })}
          >
            {shortenGithash(revision ?? "")}
          </InlineCode>
          <IconButton
            aria-label="GitHub Commit Link"
            data-cy="github-link"
            href={githubCommitUrl}
            target="__blank"
          >
            <Icon glyph="GitHub" />
          </IconButton>
          {activated ? (
            <Button
              data-cy="restart-button"
              disabled={!canRestart}
              onClick={() => {
                sendEvent({
                  name: "Clicked restart task button",
                  "task.id": taskId,
                });
                restartTask();
              }}
              size={ButtonSize.XSmall}
            >
              Restart Task
            </Button>
          ) : (
            <Button
              data-cy="schedule-button"
              disabled={!canSchedule}
              onClick={() => {
                sendEvent({
                  name: "Clicked schedule task button",
                  "task.id": taskId,
                });
                scheduleTask();
              }}
              size={ButtonSize.XSmall}
            >
              Schedule Task
            </Button>
          )}
          <NotifyMeButton buttonSize={ButtonSize.XSmall} taskId={taskId} />
          {isCurrentTask && (
            <Badge data-cy="this-task-badge" variant={BadgeVariant.Blue}>
              {isPatch ? "Base" : "This"} Task
            </Badge>
          )}
          <span>{dateCopy}</span>
          {latestExecution > 0 ? (
            <Chip
              data-cy="execution-chip"
              label={`Executions: ${latestExecution + 1}`}
              variant={ChipVariant.Gray}
            />
          ) : null}
          <PriorityContainer>
            <SetPriority
              disabled={!canSetPriority}
              initialPriority={priority ?? 0}
              isButton
              popconfirmAlign={Align.Top}
              taskIds={[taskId]}
            />
            {priority && priority > 0 ? (
              <Chip
                data-cy="priority-chip"
                label={`Priority: ${priority}`}
                variant={ChipVariant.Gray}
              />
            ) : null}
          </PriorityContainer>
        </TopLabel>
        <BottomLabel>
          {tests.testResults.length > 0 ? (
            <Accordion
              caretAlign={AccordionCaretAlign.Start}
              onToggle={({ isVisible }) =>
                sendEvent({
                  name: "Toggled failed tests table",
                  open: isVisible,
                })
              }
              title={<CommitDescription author={author} message={message} />}
            >
              <FailedTestsTable tests={tests} />
            </Accordion>
          ) : (
            <CommitDescription author={author} message={message} />
          )}
          {/* Use order label to debug issues with pagination. */}
          {!isProduction() && <OrderLabel>Order: {order}</OrderLabel>}
        </BottomLabel>
      </CommitCard>
    );
  },
);
CommitDetailsCard.displayName = "CommitDetailsCard";

export default CommitDetailsCard;

const CommitCard = styled.div<{
  status: TaskStatus;
  selected: boolean;
  isMatching: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  padding: ${size.xs};

  border-radius: ${size.xs};
  border: 1px solid ${gray.light2};
  :hover {
    border-color: ${blue.base};
  }
  ${({ selected }) => selected && `border-color: ${blue.base};`}

  /* Styles for the status stripe. Border isn't used as it interferes with hover styles. */
  ${({ status }) => `
     background: linear-gradient(to right, ${statusColorMap[status]} 10px, transparent 0px) no-repeat;
     `}
  padding-left: ${size.s};

  ${({ isMatching }) => !isMatching && inactiveElementStyle};

  scroll-margin-top: ${stickyHeaderScrollOffset}px;
`;

const TopLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
`;

const PriorityContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${size.xs};
  margin-left: auto;
`;

const BottomLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
`;

const OrderLabel = styled.div`
  margin-left: auto;
`;
