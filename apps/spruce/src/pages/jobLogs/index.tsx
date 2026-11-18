import { LinkButton } from "@via-ds/components/button";
import { H3 } from "@via-ds/components/typography";
import { useParams } from "react-router-dom";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import PageTitle from "components/PageTitle";
import {
  PageContent,
  PageLayout,
  PageSider,
  PageWrapper,
} from "components/styles";
import { getTaskRoute, slugs } from "constants/routes";
import styles from "./index.module.css";
import { JobLogsTable } from "./JobLogsTable";
import { Metadata } from "./Metadata";
import useJobLogsPageData from "./useJobLogs";

const JobLogs: React.FC = () => {
  const {
    [slugs.taskId]: taskIdFromParams,
    [slugs.execution]: executionFromParams,
    [slugs.groupId]: groupIdFromParams,
  } = useParams();

  const { loading, metadata, resultsToRender, title } = useJobLogsPageData({
    execution: executionFromParams,
    groupId: groupIdFromParams,
    taskId: taskIdFromParams,
  });

  return (
    <PageWrapper>
      <PageTitle
        badge={null}
        buttons={
          <LinkButton
            data-testid="task-link"
            href={getTaskRoute(metadata.taskId, {
              execution: metadata.execution,
            })}
          >
            Task page
          </LinkButton>
        }
        loading={loading}
        pageTitle={`Job Logs - ${title}`}
        size="large"
        subtitle={
          <div className={styles.subtitleContainer}>
            <H3>{metadata.displayName}</H3>
            <TaskStatusBadge status={metadata.taskStatus} />
          </div>
        }
        title="Job Logs"
      />

      <PageLayout className={styles.pageLayout} hasSider>
        <PageSider>
          <Metadata loading={loading} metadata={metadata} />
        </PageSider>
        <PageContent>
          <JobLogsTable loading={loading} tests={resultsToRender} />
        </PageContent>
      </PageLayout>
    </PageWrapper>
  );
};

export default JobLogs;
