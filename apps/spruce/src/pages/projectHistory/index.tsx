import { skipToken, useQuery } from "@apollo/client/react";
import { Button } from "@via-ds/components";
import { H2 } from "@via-ds/components/typography";
import { useParams } from "react-router-dom";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { ProjectBanner } from "components/Banners";
import { PageWrapper } from "components/styles";
import { slugs } from "constants/routes";
import {
  ProjectCommitHistoryQuery,
  ProjectCommitHistoryQueryVariables,
} from "gql/generated/types";
import { PROJECT_COMMIT_HISTORY } from "gql/queries";
import { HistoryTable } from "./HistoryTable";

const ProjectHistory: React.FC = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  usePageTitle(`${projectIdentifier} History`);

  const { data, fetchMore } = useQuery<
    ProjectCommitHistoryQuery,
    ProjectCommitHistoryQueryVariables
  >(
    PROJECT_COMMIT_HISTORY,
    projectIdentifier
      ? {
          variables: {
            options: {
              projectIdentifier,
              limit: 10,
            },
          },
        }
      : skipToken,
  );

  if (!data) {
    return null;
  }

  return (
    <PageWrapper>
      <ProjectBanner projectIdentifier={projectIdentifier} />
      <H2>Project History</H2>
      <HistoryTable versions={data?.waterfall?.versions ?? []} />
      <Button
        onClick={() =>
          fetchMore({
            variables: {
              options: {
                projectIdentifier,
                limit: 10,
                maxOrder: data?.waterfall?.pagination?.nextPageOrder,
              },
            },
            updateQuery(existing, { fetchMoreResult }) {
              return {
                waterfall: {
                  pagination: fetchMoreResult.waterfall.pagination,
                  versions: [
                    ...(existing?.waterfall?.versions ?? []),
                    ...(fetchMoreResult?.waterfall?.versions ?? []),
                  ],
                },
              };
            },
          })
        }
      >
        Fetch more
      </Button>
    </PageWrapper>
  );
};

export default ProjectHistory;
