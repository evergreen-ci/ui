import { useEffect } from "react";
import { CombinedGraphQLErrors } from "@apollo/client";
import { skipToken, useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { useErrorToast, useQueryParam } from "@evg-ui/lib/hooks";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useTaskAnalytics } from "analytics";
import { TTLInfo } from "components/404/TTLInfo";
import { ProjectBanner } from "components/Banners";
import { PatchAndTaskFullPageLoad } from "components/Loading/PatchAndTaskFullPageLoad";
import PageTitle from "components/PageTitle";
import {
  PageWrapper,
  PageContent,
  PageLayout,
  PageSider,
} from "components/styles";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { slugs } from "constants/routes";
import { TaskQuery, TaskQueryVariables } from "gql/generated/types";
import { TASK } from "gql/queries";
import { usePolling } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PageDoesNotExist } from "pages/NotFound";
import { RequiredQueryParams } from "types/task";
import { ActionButtons } from "./task/ActionButtons";
import TaskPageBreadcrumbs from "./task/Breadcrumbs";
import ExecutionSelector from "./task/ExecutionSelector";
import { Metadata } from "./task/metadata";
import TaskTabs from "./task/taskTabs";

export const Task = () => {
  const { [slugs.taskId]: taskId } = useParams<{
    [slugs.taskId]: string;
  }>();
  const taskAnalytics = useTaskAnalytics();
  const updateQueryParams = useUpdateURLQueryParams();
  const [selectedExecution, setSelectedExecution] = useQueryParam<
    number | null
  >(RequiredQueryParams.Execution, null);

  // Query task data
  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    TaskQuery,
    TaskQueryVariables
  >(
    TASK,
    taskId
      ? {
          variables: { taskId: taskId, execution: selectedExecution },
          pollInterval: DEFAULT_POLL_INTERVAL,
          fetchPolicy: "network-only",
          errorPolicy: "all",
        }
      : skipToken,
  );
  usePolling<TaskQuery, TaskQueryVariables>({
    startPolling,
    stopPolling,
    refetch,
  });

  useErrorToast(
    error,
    "Loading task",
    CombinedGraphQLErrors.is(error) &&
      error.errors.some((e) => !e?.path?.includes("annotation")),
  );

  // Update the default execution in the url if it isn't populated
  useEffect(() => {
    if (
      selectedExecution === null &&
      data?.task?.latestExecution !== undefined
    ) {
      setSelectedExecution(data.task.latestExecution);
    }
  }, [data?.task?.latestExecution, selectedExecution, setSelectedExecution]);

  const { task } = data ?? {};
  const {
    displayName,
    displayStatus,
    displayTask,
    executionTasksFull,
    latestExecution,
    patchNumber,
    priority,
    status,
    versionMetadata,
  } = task ?? {};

  /**
   * Special handling for known issues and show the original status on the task page.
   */
  const shouldShowOriginalStatus = displayStatus === TaskStatus.KnownIssue;
  const isDisplayTask = executionTasksFull != null;

  if (loading) {
    return <PatchAndTaskFullPageLoad />;
  }
  if (error && !task) {
    return (
      <PageWrapper omitPadding>
        <TTLInfo>
          <PageDoesNotExist />
        </TTLInfo>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
      <ProjectBanner projectIdentifier={versionMetadata?.projectIdentifier} />
      {task && (
        <TaskPageBreadcrumbs
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          displayTask={displayTask}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          patchNumber={patchNumber}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          taskName={displayName}
          versionMetadata={versionMetadata}
        />
      )}
      <PageTitle
        badge={
          <StyledBadgeWrapper>
            <TaskStatusBadge
              status={
                (shouldShowOriginalStatus
                  ? status
                  : displayStatus) as TaskStatus
              }
            />
            {shouldShowOriginalStatus && (
              <TaskStatusBadge status={TaskStatus.KnownIssue} />
            )}
          </StyledBadgeWrapper>
        }
        buttons={
          task ? (
            <ActionButtons
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              initialPriority={priority}
              isDisplayTask={isDisplayTask}
              isExecutionTask={!!displayTask}
              task={task}
            />
          ) : undefined
        }
        loading={loading}
        pageTitle={`Task${displayName ? ` - ${displayName}` : ""}`}
        title={displayName}
      />
      <PageLayout hasSider>
        <PageSider>
          {task &&
          latestExecution &&
          latestExecution > 0 &&
          selectedExecution !== null ? (
            <ExecutionSelector
              currentExecution={selectedExecution}
              latestExecution={latestExecution}
              taskId={task.id}
              updateExecution={(n: number) => {
                taskAnalytics.sendEvent({ name: "Changed execution" });
                updateQueryParams({
                  execution: `${n}`,
                });
              }}
            />
          ) : null}
          <Metadata error={error} loading={loading} task={task} />
        </PageSider>
        <StyledPageContent>
          {task && selectedExecution !== null && (
            <TaskTabs isDisplayTask={isDisplayTask} task={task} />
          )}
        </StyledPageContent>
      </PageLayout>
    </PageWrapper>
  );
};

const StyledBadgeWrapper = styled.div`
  > :nth-of-type(2) {
    margin-left: 10px;
  }
`;

const StyledPageContent = styled(PageContent)`
  // Unset overflow so that sticky header in Task History tab can work properly.
  overflow: unset;
`;
