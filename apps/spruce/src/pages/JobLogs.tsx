import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Body, H3 } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { useJobLogsAnalytics } from "analytics/joblogs/useJobLogsAnalytics";
import { PageWrapper, StyledRouterLink } from "components/styles";
import { getParsleyBuildLogURL } from "constants/externalResources";
import { getTaskRoute, slugs } from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import { usePageTitle } from "hooks";
import { JobLogsTable } from "./jobLogs/JobLogsTable";
import useJobLogsPageData from "./jobLogs/useJobLogs";

interface JobLogsProps {
  isLogkeeper: boolean;
}
export const JobLogs: React.FC<JobLogsProps> = ({ isLogkeeper }) => {
  const {
    [slugs.buildId]: buildIdFromParams,
    [slugs.taskId]: taskIdFromParams,
    [slugs.execution]: executionFromParams,
    [slugs.groupId]: groupIdFromParams,
  } = useParams();

  const dispatchToast = useToastContext();
  const { sendEvent } = useJobLogsAnalytics(isLogkeeper);

  usePageTitle(`Job Logs - ${buildIdFromParams || groupIdFromParams}`);

  const { execution, loading, resultsToRender, taskId, title } =
    useJobLogsPageData({
      buildId: buildIdFromParams,
      execution: executionFromParams,
      groupId: groupIdFromParams,
      onError: (err) => {
        dispatchToast.error(err);
      },
      taskId: taskIdFromParams,
      isLogkeeper,
    });

  return (
    <PageWrapper>
      <ContentWrapper>
        <TaskMetadata>
          <H3>{title}</H3>
          {taskId && (
            <Body>
              Task:{" "}
              <StyledRouterLink
                to={getTaskRoute(taskId, { execution })}
                data-cy="task-link"
              >
                {taskId}
              </StyledRouterLink>
            </Body>
          )}
        </TaskMetadata>
        {isLogkeeper && (
          <CompleteLogsLink>
            <Button
              href={getParsleyBuildLogURL(buildIdFromParams)}
              data-cy="complete-test-logs-link"
              target="_blank"
              onClick={() => {
                sendEvent({
                  name: "Clicked complete logs link",
                  buildId: buildIdFromParams,
                });
              }}
            >
              Complete logs for all tests
            </Button>
          </CompleteLogsLink>
        )}
        <JobLogsTable
          buildId={buildIdFromParams}
          tests={resultsToRender}
          taskID={taskId}
          execution={execution}
          isLogkeeper={isLogkeeper}
          loading={loading}
        />
      </ContentWrapper>
    </PageWrapper>
  );
};

const CompleteLogsLink = styled.div`
  margin: ${size.s} 0;
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${size.s};
`;
const TaskMetadata = styled.div`
  word-break: break-all;
`;
