import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  ProjectEventLogsQuery,
  ProjectEventLogsQueryVariables,
  RepoEventLogsQuery,
  RepoEventLogsQueryVariables,
} from "gql/generated/types";
import { PROJECT_EVENT_LOGS, REPO_EVENT_LOGS } from "gql/queries";
import { useErrorToast } from "hooks";
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
  const { allEventsFetched, onCompleted, setPrevCount } = useEvents(limit);

  const {
    data: projectEventData,
    error: projectError,
    fetchMore: projectFetchMore,
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

  // Handle onCompleted for project events
  useEffect(() => {
    if (projectEventData?.projectEvents?.count !== undefined) {
      const previousCount = projectPreviousData?.projectEvents?.count ?? 0;
      onCompleted(projectEventData.projectEvents.count, previousCount);
    }
  }, [
    projectEventData?.projectEvents?.count,
    projectPreviousData,
    onCompleted,
  ]);

  // Handle onCompleted for repo events
  useEffect(() => {
    if (repoEventData?.repoEvents?.count !== undefined) {
      const previousCount = repoPreviousData?.repoEvents?.count ?? 0;
      onCompleted(repoEventData.repoEvents.count, previousCount);
    }
  }, [repoEventData?.repoEvents?.count, repoPreviousData, onCompleted]);

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
