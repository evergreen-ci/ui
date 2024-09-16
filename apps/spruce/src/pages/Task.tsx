import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useParams, useLocation } from "react-router-dom";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useTaskAnalytics } from "analytics";
import { ProjectBanner } from "components/Banners";
import PageTitle from "components/PageTitle";
import {
  PageWrapper,
  PageContent,
  PageLayout,
  PageSider,
} from "components/styles";
import TaskStatusBadge from "components/TaskStatusBadge";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { slugs } from "constants/routes";
import { useToastContext } from "context/toast";
import { TaskQuery, TaskQueryVariables } from "gql/generated/types";
import { TASK } from "gql/queries";
import { usePolling } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PageDoesNotExist } from "pages/NotFound";
import { RequiredQueryParams } from "types/task";
import { queryString } from "utils";
import { ActionButtons } from "./task/ActionButtons";
import TaskPageBreadcrumbs from "./task/Breadcrumbs";
import { ExecutionSelect } from "./task/executionDropdown/ExecutionSelector";
import { Metadata } from "./task/metadata";
import { TaskTabs } from "./task/TaskTabs";

const { parseQueryString } = queryString;

export const Task = () => {
  const { [slugs.taskId]: taskId } = useParams();
  const dispatchToast = useToastContext();
  const taskAnalytics = useTaskAnalytics();
  const location = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);

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
    onError: (err) =>
      dispatchToast.error(
        `There was an error loading the task: ${err.message}`,
      ),
  });
  usePolling({ startPolling, stopPolling, refetch });

  const { task } = data ?? {};
  const {
    annotation,
    displayName,
    displayTask,
    executionTasksFull,
    latestExecution,
    patchNumber,
    priority,
    status,
    versionMetadata,
  } = task ?? {};
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const attributed = annotation?.issues?.length > 0;
  const isDisplayTask = executionTasksFull != null;
  if (error && !task) {
    return <PageDoesNotExist />;
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
            {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
            <TaskStatusBadge status={status} />
            {attributed && <TaskStatusBadge status={TaskStatus.KnownIssue} />}
          </StyledBadgeWrapper>
        }
        buttons={
          <ActionButtons
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            initialPriority={priority}
            isDisplayTask={isDisplayTask}
            isExecutionTask={!!displayTask}
            task={task}
          />
        }
        loading={loading}
        pageTitle={`Task${displayName ? ` - ${displayName}` : ""}`}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        title={displayName}
      />
      <PageLayout hasSider>
        <PageSider>
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          {latestExecution > 0 && (
            <ExecutionSelect
              currentExecution={selectedExecution}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              id={taskId}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              latestExecution={latestExecution}
              updateExecution={(n: number) => {
                taskAnalytics.sendEvent({ name: "Changed execution" });
                updateQueryParams({
                  execution: `${n}`,
                });
              }}
            />
          )}
          <Metadata
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            error={error}
            loading={loading}
            task={task}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            taskId={taskId}
          />
        </PageSider>
        <PageContent>
          {task && <TaskTabs isDisplayTask={isDisplayTask} task={task} />}
        </PageContent>
      </PageLayout>
    </PageWrapper>
  );
};

const StyledBadgeWrapper = styled.div`
  > :nth-of-type(2) {
    margin-left: 10px;
  }
`;
