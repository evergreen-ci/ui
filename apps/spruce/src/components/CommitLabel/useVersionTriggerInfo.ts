import { skipToken, useQuery } from "@apollo/client/react";
import {
  VersionTriggerInfoQuery,
  VersionTriggerInfoQueryVariables,
} from "gql/generated/types";
import { VERSION_TRIGGER_INFO } from "gql/queries";

/**
 * Fetches data for trigger versions.
 * @param isTrigger - whether the version was created by a trigger; the query is skipped when false
 * @param versionId - ID of the version to fetch trigger details for
 * @returns the upstream project and repotracker base version
 */
export const useVersionTriggerInfo = (
  isTrigger: boolean,
  versionId: string,
) => {
  const { data } = useQuery<
    VersionTriggerInfoQuery,
    VersionTriggerInfoQueryVariables
  >(VERSION_TRIGGER_INFO, isTrigger ? { variables: { versionId } } : skipToken);
  return {
    upstreamProject: data?.version?.upstreamProject,
    repotrackerBaseVersion: data?.version?.repotrackerBaseVersion,
  };
};
