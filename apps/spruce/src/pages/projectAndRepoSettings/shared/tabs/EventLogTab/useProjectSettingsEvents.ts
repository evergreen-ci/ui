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
    fetchMore: projectFetchMore,
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

  const {
    data: repoEventData,
    error: repoError,
    fetchMore: repoFetchMore,
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

  const events = isRepo
    ? repoEventData?.repoEvents?.eventLogEntries || []
    : projectEventData?.projectEvents?.eventLogEntries || [];

  const loading = isRepo ? repoLoading : projectLoading;

  const lastFetchedCount = isRepo
    ? repoEventData?.repoEvents?.count
    : projectEventData?.projectEvents?.count;

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  const handleFetchMore = useCallback(
    () =>
      isRepo
        ? repoFetchMore({
            variables: { repoId, before: lastEventTimestamp },
            updateQuery: getEventsUpdateQuery<"repoEvents", RepoEventLogsQuery>(
              "repoEvents",
            ),
          })
        : projectFetchMore({
            variables: { projectIdentifier, before: lastEventTimestamp },
            updateQuery: getEventsUpdateQuery<
              "projectEvents",
              ProjectEventLogsQuery
            >("projectEvents"),
          }),
    [
      isRepo,
      lastEventTimestamp,
      projectFetchMore,
      projectIdentifier,
      repoFetchMore,
      repoId,
    ],
  );

  return {
    events,
    handleFetchMore,
    lastFetchedCount,
    loading,
  };
};
