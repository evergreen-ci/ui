import { useCallback, useState } from "react";
import { skipToken, useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { useProjectHistoryAnalytics } from "analytics";
import { ProjectBanner } from "components/Banners";
import { LoadingButton } from "components/Buttons";
import { ProjectSelect } from "components/ProjectSelect";
import { PageButtonRow, PageTitle, PageWrapper } from "components/styles";
import { getProjectCommitsRoute, slugs } from "constants/routes";
import {
  ProjectCommitHistoryQuery,
  ProjectCommitHistoryQueryVariables,
} from "gql/generated/types";
import { PROJECT_COMMIT_HISTORY } from "gql/queries";
import { HistoryTable } from "./HistoryTable";
import styles from "./styles.module.css";

const baseOptions = {
  limit: 50,
};

const ProjectCommits: React.FC = () => {
  const [loadingMore, setLoadingMore] = useState(false);

  const { sendEvent } = useProjectHistoryAnalytics({
    page: "Project commit history",
  });

  const { [slugs.projectIdentifier]: projectIdentifier } =
    useParams() as Record<string, string>;
  usePageTitle(`${projectIdentifier} Commits`);

  const { data, dataState, fetchMore, loading } = useQuery<
    ProjectCommitHistoryQuery,
    ProjectCommitHistoryQueryVariables
  >(
    PROJECT_COMMIT_HISTORY,
    projectIdentifier
      ? {
          variables: {
            projectIdentifier,
            options: {
              ...baseOptions,
            },
          },
        }
      : skipToken,
  );

  const getCommitsRoute = useCallback(
    (identifier: string) => getProjectCommitsRoute(identifier),
    [],
  );

  const handleFetchMore = async () => {
    setLoadingMore(true);
    try {
      await fetchMore({
        variables: {
          projectIdentifier,
          options: {
            ...baseOptions,
            maxOrder: data?.project?.commits?.pagination?.nextPageOrder,
          },
        },
      });
    } finally {
      setLoadingMore(false);
      sendEvent({
        name: "Clicked load more button",
      });
    }
  };

  return (
    <PageWrapper>
      <ProjectBanner projectIdentifier={projectIdentifier} />
      <PageButtonRow className={styles.pageButtonRow}>
        <PageTitle className={styles.pageTitle}>Project Commits</PageTitle>

        <ProjectSelect
          className={styles.projectSelect}
          getProjectRoute={getCommitsRoute}
          onSubmit={(project: string) => {
            sendEvent({
              name: "Changed project",
              project,
            });
          }}
          selectedProjectIdentifier={projectIdentifier}
        />
      </PageButtonRow>
      <HistoryTable
        loading={dataState !== "complete" && loading} // Only show loading state initially
        versions={data?.project?.commits?.versions}
      />
      {data?.project?.commits?.pagination?.hasNextPage && (
        <div className={styles.loadMoreButton}>
          <LoadingButton
            loading={loadingMore}
            onClick={handleFetchMore}
            variant="primary"
          >
            Show more commits
          </LoadingButton>
        </div>
      )}
    </PageWrapper>
  );
};

export default ProjectCommits;
