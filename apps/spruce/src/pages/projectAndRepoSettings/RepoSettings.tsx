import { useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { useErrorToast, usePageTitle } from "@evg-ui/lib/hooks";
import { slugs } from "constants/routes";
import {
  RepoSettingsQuery,
  RepoSettingsQueryVariables,
} from "gql/generated/types";
import { REPO_SETTINGS } from "gql/queries";
import SharedSettings from "./shared";
import { ProjectType } from "./shared/tabs/utils";

const RepoSettings: React.FC = () => {
  const { [slugs.repoId]: repoId = "" } = useParams<{
    [slugs.repoId]: string;
  }>();
  usePageTitle(`Repo Settings | ${repoId}`);

  const {
    data: repoData,
    error,
    loading: repoLoading,
  } = useQuery<RepoSettingsQuery, RepoSettingsQueryVariables>(REPO_SETTINGS, {
    skip: !repoId,
    variables: { repoId },
  });
  useErrorToast(error, `There was an error loading the repo ${repoId}`);

  const repo = repoData?.repoSettings;

  const ownerName = repo?.projectRef?.owner ?? "";
  const repoName = repo?.projectRef?.repo ?? "";

  const hasLoaded = !repoLoading && !!repo;

  return (
    <SharedSettings
      hasLoaded={hasLoaded}
      owner={ownerName}
      projectData={undefined}
      projectIdentifier=""
      projectType={ProjectType.Repo}
      repo={repoName}
      repoData={repo}
      repoId={repoId}
    />
  );
};

export default RepoSettings;
