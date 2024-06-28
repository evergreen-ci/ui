import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useParams, useLocation } from "react-router-dom";
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
import { RequiredQueryParams, TaskStatus } from "types/task";
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

  if (error) {
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
        pageTitle={`Task${displayName ? ` - ${displayName}` : ""}`}
        loading={loading}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        title={displayName}
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
      />
      <PageLayout hasSider>
        <PageSider>
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          {latestExecution > 0 && (
            <ExecutionSelect
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              id={taskId}
              currentExecution={selectedExecution}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              latestExecution={latestExecution}
              updateExecution={(n: number) => {
                taskAnalytics.sendEvent({ name: "Change Execution" });
                updateQueryParams({
                  execution: `${n}`,
                });
              }}
            />
          )}
          <Metadata
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            taskId={taskId}
            task={task}
            loading={loading}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            error={error}
          />
        </PageSider>
        <LogWrapper>
          <PageContent>
            {task && <TaskTabs task={task} isDisplayTask={isDisplayTask} />}
          </PageContent>
        </LogWrapper>
      </PageLayout>
    </PageWrapper>
  );
};

const LogWrapper = styled(PageLayout)`
  width: 100%;
`;

const StyledBadgeWrapper = styled.div`
  > :nth-of-type(2) {
    margin-left: 10px;
  }
`;
