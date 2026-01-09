import { useQuery } from "@apollo/client";
import { useErrorToast } from "@evg-ui/lib/hooks";
import {
  ProjectEventLogsQuery,
  ProjectEventLogsQueryVariables,
  RepoEventLogsQuery,
  RepoEventLogsQueryVariables,
} from "gql/generated/types";
import { PROJECT_EVENT_LOGS, REPO_EVENT_LOGS } from "gql/queries";

export const PROJECT_EVENT_LIMIT = 15;

export const useProjectSettingsEvents = ({
  isRepo,
  limit = PROJECT_EVENT_LIMIT,
  projectIdentifier = "",
  repoId = "",
}: {
  projectIdentifier?: string;
  repoId?: string;
  isRepo: boolean;
  limit?: number;
}) => {
  const {
    data: projectEventData,
    error: projectError,
    fetchMore: projectFetchMore,
    loading: projectLoading,
    previousData: projectPreviousData,
  } = useQuery<ProjectEventLogsQuery, ProjectEventLogsQueryVariables>(
    PROJECT_EVENT_LOGS,
    {
      variables: { projectIdentifier, limit },
      errorPolicy: "all",
      skip: isRepo || !projectIdentifier,
      notifyOnNetworkStatusChange: true,
    },
  );
  useErrorToast(
    projectError,
    `Unable to fetch events for ${projectIdentifier}`,
  );

  const {
    data: repoEventData,
    error: repoError,
    fetchMore: repoFetchMore,
    loading: repoLoading,
    previousData: repoPreviousData,
  } = useQuery<RepoEventLogsQuery, RepoEventLogsQueryVariables>(
    REPO_EVENT_LOGS,
    {
      variables: { repoId, limit },
      errorPolicy: "all",
      skip: !isRepo || !repoId,
      notifyOnNetworkStatusChange: true,
    },
  );
  useErrorToast(repoError, `Unable to fetch events for ${repoId}`);

  // Determine count and previousCount based on whether we're viewing project or repo
  const count = isRepo
    ? repoEventData?.repoEvents?.count
    : projectEventData?.projectEvents?.count;
  const previousCount = isRepo
    ? (repoPreviousData?.repoEvents?.count ?? 0)
    : (projectPreviousData?.projectEvents?.count ?? 0);

  const events = isRepo
    ? repoEventData?.repoEvents?.eventLogEntries || []
    : projectEventData?.projectEvents?.eventLogEntries || [];

  const fetchMore = isRepo ? repoFetchMore : projectFetchMore;

  const loading = isRepo ? repoLoading : projectLoading;

  return { count, events, fetchMore, loading, previousCount };
};
