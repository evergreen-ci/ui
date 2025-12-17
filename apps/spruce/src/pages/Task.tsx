import { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useQueryParam } from "@evg-ui/lib/hooks";
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
  const dispatchToast = useToastContext();
  const taskAnalytics = useTaskAnalytics();
  const updateQueryParams = useUpdateURLQueryParams();
  const [selectedExecution, setSelectedExecution] = useQueryParam<
    number | null
  >(RequiredQueryParams.Execution, null);

  // Query task data
  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    TaskQuery,
    TaskQueryVariables
  >(TASK, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { taskId, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });
  usePolling({ startPolling, stopPolling, refetch });

  // Show error toast for non-annotation errors only
  const lastErrorMessage = useRef<string | null>(null);
  useEffect(() => {
    if (error && error.message !== lastErrorMessage.current) {
      // We shouldn't show errors about annotation permissions resulting from the task resolver,
      // but we can't separate out the query because we need to identify if the user has permissions
      // to hide the tab accordingly. Thus, if an error comes from the annotation resolver, don't show a toast.
      const hasNonAnnotationErrors = error?.graphQLErrors?.some(
        (e) => !e?.path?.includes("annotation"),
      );
      if (hasNonAnnotationErrors) {
        lastErrorMessage.current = error.message;
        dispatchToast.error(
          `There was an error loading the task: ${error.message}`,
        );
      }
    }
    if (!error) {
      lastErrorMessage.current = null;
    }
  }, [error, dispatchToast]);

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

  // Update the default execution in the url if it isn't populated
  useEffect(() => {
    if (selectedExecution === null && task) {
      setSelectedExecution(task.latestExecution);
    }
  }, [task, selectedExecution, setSelectedExecution]);

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
