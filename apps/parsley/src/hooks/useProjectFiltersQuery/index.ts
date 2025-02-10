import { useQuery } from "@apollo/client";
import {
  ProjectFiltersQuery,
  ProjectFiltersQueryVariables,
  RepoFiltersQuery,
  RepoFiltersQueryVariables,
} from "gql/generated/types";
import { PROJECT_FILTERS, REPO_FILTERS } from "gql/queries";

interface UseProjectQueryProps {
  projectIdentifier?: string;
  repoRefId?: string;
}
export const useProjectFiltersQuery = ({
  projectIdentifier = "",
  repoRefId = "",
}: UseProjectQueryProps) => {
  const { data: projectData } = useQuery<
    ProjectFiltersQuery,
    ProjectFiltersQueryVariables
  >(PROJECT_FILTERS, {
    skip: !projectIdentifier,
    variables: { projectIdentifier },
  });

  const { data: repoData } = useQuery<
    RepoFiltersQuery,
    RepoFiltersQueryVariables
  >(REPO_FILTERS, {
    skip: !!projectIdentifier || !repoRefId,
    variables: { repoRefId },
  });

  return (
    projectData?.project.parsleyFilters ||
    repoData?.repoSettings?.projectRef?.parsleyFilters
  );
};
