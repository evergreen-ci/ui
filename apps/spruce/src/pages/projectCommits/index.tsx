import { useCallback, useState } from "react";
import { skipToken, useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
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

const baseOptions = {
  limit: 20,
};

const ProjectCommits: React.FC = () => {
  const [loadingMore, setLoadingMore] = useState(false);
  const { [slugs.projectIdentifier]: projectIdentifier } =
    useParams() as Record<string, string>;
  usePageTitle(`${projectIdentifier} Commits`);

  const { data, fetchMore } = useQuery<
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
        updateQuery(existing, { fetchMoreResult }) {
          return {
            ...existing,
            project: {
              ...existing.project,
              commits: {
                ...fetchMoreResult.project.commits,
                versions: [
                  ...existing.project.commits.versions,
                  ...fetchMoreResult.project.commits.versions,
                ],
              },
            },
          };
        },
      });
    } finally {
      setLoadingMore(false);
    }
  };

  if (!data) {
    return null;
  }

  return (
    <PageWrapper>
      <ProjectBanner projectIdentifier={projectIdentifier} />
      <PageButtonRow
        style={{ justifyContent: "space-between", paddingBottom: "16px" }}
      >
        <PageTitle>Project Commits</PageTitle>

        <ProjectSelect
          getProjectRoute={getCommitsRoute}
          selectedProjectIdentifier={projectIdentifier}
        />
      </PageButtonRow>
      <HistoryTable versions={data.project.commits.versions} />
      {data.project.commits.pagination?.hasNextPage && (
        <LoadingButton
          loading={loadingMore}
          onClick={handleFetchMore}
          variant="primary"
        >
          Fetch more
        </LoadingButton>
      )}
    </PageWrapper>
  );
};

export default ProjectCommits;
