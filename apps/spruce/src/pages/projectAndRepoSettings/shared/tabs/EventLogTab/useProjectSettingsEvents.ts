import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  ProjectEventLogsQuery,
  ProjectEventLogsQueryVariables,
  RepoEventLogsQuery,
  RepoEventLogsQueryVariables,
} from "gql/generated/types";
import { PROJECT_EVENT_LOGS, REPO_EVENT_LOGS } from "gql/queries";
import { useEvents } from "hooks/useEvents";

const PROJECT_EVENT_LIMIT = 15;

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
  const dispatchToast = useToastContext();

  const { allEventsFetched, onCompleted, setPrevCount } = useEvents(limit);

  const {
    data: projectEventData,
    fetchMore: projectFetchMore,
    previousData: projectPreviousData,
  } = useQuery<ProjectEventLogsQuery, ProjectEventLogsQueryVariables>(
    PROJECT_EVENT_LOGS,
    {
      variables: { projectIdentifier, limit },
      errorPolicy: "all",
      skip: isRepo || !projectIdentifier,
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ projectEvents: { count } }) => onCompleted(count),
      onError: (e) => {
        dispatchToast.error(
          `Unable to fetch events for ${projectIdentifier}: ${e}`,
        );
      },
    },
  );

  const {
    data: repoEventData,
    fetchMore: repoFetchMore,
    previousData: repoPreviousData,
  } = useQuery<RepoEventLogsQuery, RepoEventLogsQueryVariables>(
    REPO_EVENT_LOGS,
    {
      variables: { repoId, limit },
      errorPolicy: "all",
      skip: !isRepo || !repoId,
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ repoEvents: { count } }) => onCompleted(count),
      onError: (e) => {
        dispatchToast.error(
          `Unable to fetch events for ${projectIdentifier}: ${e}`,
        );
      },
    },
  );

  const events = isRepo
    ? repoEventData?.repoEvents?.eventLogEntries || []
    : projectEventData?.projectEvents?.eventLogEntries || [];

  const fetchMore = isRepo ? repoFetchMore : projectFetchMore;

  const previousData = isRepo
    ? repoPreviousData?.repoEvents
    : projectPreviousData?.projectEvents;

  useEffect(() => {
    setPrevCount(previousData?.count ?? 0);
  }, [previousData, setPrevCount]);

  return { allEventsFetched, events, fetchMore };
};
