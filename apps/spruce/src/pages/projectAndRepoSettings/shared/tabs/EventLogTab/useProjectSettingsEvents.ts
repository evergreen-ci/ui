import { useCallback } from "react";
import { skipToken, useQuery } from "@apollo/client/react";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { getEventsUpdateQuery } from "components/Settings/EventLog/useEvents";
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
    fetchMore: projectFetchMoreBase,
    loading: projectLoading,
  } = useQuery<ProjectEventLogsQuery, ProjectEventLogsQueryVariables>(
    PROJECT_EVENT_LOGS,
    projectIdentifier && !isRepo
      ? {
          variables: { projectIdentifier, limit },
          fetchPolicy: "no-cache",
          errorPolicy: "all",
          notifyOnNetworkStatusChange: true,
        }
      : skipToken,
  );
  useErrorToast(
    projectError,
    `Unable to fetch events for ${projectIdentifier}`,
  );

  const projectFetchMore = useCallback(
    (options: Parameters<typeof projectFetchMoreBase>[0]) =>
      projectFetchMoreBase({
        ...options,
        updateQuery: getEventsUpdateQuery<
          "projectEvents",
          ProjectEventLogsQuery
        >("projectEvents"),
      }),
    [projectFetchMoreBase],
  );

  const {
    data: repoEventData,
    error: repoError,
    fetchMore: repoFetchMoreBase,
    loading: repoLoading,
  } = useQuery<RepoEventLogsQuery, RepoEventLogsQueryVariables>(
    REPO_EVENT_LOGS,
    isRepo && repoId
      ? {
          variables: { repoId, limit },
          fetchPolicy: "no-cache",
          errorPolicy: "all",
          notifyOnNetworkStatusChange: true,
        }
      : skipToken,
  );
  useErrorToast(repoError, `Unable to fetch events for ${repoId}`);

  const repoFetchMore = useCallback(
    (options: Parameters<typeof repoFetchMoreBase>[0]) =>
      repoFetchMoreBase({
        ...options,
        updateQuery: getEventsUpdateQuery<"repoEvents", RepoEventLogsQuery>(
          "repoEvents",
        ),
      }),
    [repoFetchMoreBase],
  );

  const events = isRepo
    ? repoEventData?.repoEvents?.eventLogEntries || []
    : projectEventData?.projectEvents?.eventLogEntries || [];

  const loading = isRepo ? repoLoading : projectLoading;

  const lastFetchedCount = isRepo
    ? repoEventData?.repoEvents?.count
    : projectEventData?.projectEvents?.count;

  return {
    events,
    lastFetchedCount,
    loading,
    projectFetchMore,
    repoFetchMore,
  };
};
