import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks/usePageVisibilityAnalytics";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
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
  usePageVisibilityAnalytics();
  const dispatchToast = useToastContext();
  usePageTitle(`Repo Settings | ${repoId}`);

  const { data: repoData, loading: repoLoading } = useQuery<
    RepoSettingsQuery,
    RepoSettingsQueryVariables
  >(REPO_SETTINGS, {
    skip: !repoId,
    variables: { repoId },
    onError: (e) => {
      dispatchToast.error(
        `There was an error loading the repo ${repoId}: ${e.message}`,
      );
    },
  });

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
