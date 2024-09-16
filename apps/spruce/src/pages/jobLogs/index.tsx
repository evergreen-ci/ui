import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { H3 } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import PageTitle from "components/PageTitle";
import {
  PageContent,
  PageLayout,
  PageSider,
  PageWrapper,
} from "components/styles";
import TaskStatusBadge from "components/TaskStatusBadge";
import { getTaskRoute, slugs } from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import { JobLogsTable } from "./JobLogsTable";
import { Metadata } from "./Metadata";
import useJobLogsPageData from "./useJobLogs";

interface JobLogsProps {
  isLogkeeper: boolean;
}
const JobLogs: React.FC<JobLogsProps> = ({ isLogkeeper }) => {
  const {
    [slugs.buildId]: buildIdFromParams,
    [slugs.taskId]: taskIdFromParams,
    [slugs.execution]: executionFromParams,
    [slugs.groupId]: groupIdFromParams,
  } = useParams();

  const dispatchToast = useToastContext();

  const { loading, metadata, resultsToRender, title } = useJobLogsPageData({
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
      <PageTitle
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        badge={null}
        buttons={
          <Button
            data-cy="task-link"
            href={getTaskRoute(metadata.taskId, {
              execution: metadata.execution,
            })}
          >
            Task page
          </Button>
        }
        loading={loading}
        pageTitle={`Job Logs - ${title}`}
        size="large"
        subtitle={
          <SubtitleContainer>
            <H3>{metadata.displayName}</H3>
            {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
            <TaskStatusBadge status={metadata.taskStatus} />
          </SubtitleContainer>
        }
        title="Job Logs"
      />

      <StyledPageLayout hasSider>
        <PageSider>
          <Metadata loading={loading} metadata={metadata} />
        </PageSider>
        <PageContent>
          <JobLogsTable
            buildId={buildIdFromParams}
            isLogkeeper={isLogkeeper}
            loading={loading}
            tests={resultsToRender}
          />
        </PageContent>
      </StyledPageLayout>
    </PageWrapper>
  );
};

const StyledPageLayout = styled(PageLayout)`
  padding-top: ${size.m};
`;

const SubtitleContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: ${size.s};
`;
export default JobLogs;
