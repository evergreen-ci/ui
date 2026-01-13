import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Checkbox } from "@leafygreen-ui/checkbox";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { useQueryParam, useErrorToast } from "@evg-ui/lib/hooks";
import { useProjectPatchesAnalytics } from "analytics/patches/useProjectPatchesAnalytics";
import { ProjectBanner } from "components/Banners";
import { PatchesPage } from "components/PatchesPage";
import { usePatchesQueryParams } from "components/PatchesPage/usePatchesQueryParams";
import { ProjectSelect } from "components/ProjectSelect";
import { INCLUDE_COMMIT_QUEUE_PROJECT_PATCHES } from "constants/cookies";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { getProjectPatchesRoute, slugs } from "constants/routes";
import {
  ProjectPatchesQuery,
  ProjectPatchesQueryVariables,
} from "gql/generated/types";
import { PROJECT_PATCHES } from "gql/queries";
import { usePolling } from "hooks";
import { PatchPageQueryParams } from "types/patch";

export const ProjectPatches = () => {
  const analytics = useProjectPatchesAnalytics();
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();

  const [
    isGitHubMergeQueueCheckboxChecked,
    setIsGitHubMergeQueueCheckboxChecked,
  ] = useQueryParam(
    PatchPageQueryParams.MergeQueue,
    Cookies.get(INCLUDE_COMMIT_QUEUE_PROJECT_PATCHES) === "true",
  );

  const gitHubMergeQueueCheckboxOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setIsGitHubMergeQueueCheckboxChecked(e.target.checked);
    Cookies.set(
      INCLUDE_COMMIT_QUEUE_PROJECT_PATCHES,
      e.target.checked ? "true" : "false",
    );
    analytics.sendEvent({
      name: "Filtered for patches",
      "filter.commit_queue": e.target.checked,
    });
  };

  const patchesInput = usePatchesQueryParams();

  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    ProjectPatchesQuery,
    ProjectPatchesQueryVariables
  >(PROJECT_PATCHES, {
    variables: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      projectIdentifier,
      patchesInput: {
        ...patchesInput,
        onlyMergeQueue: isGitHubMergeQueueCheckboxChecked,
      },
    },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  useErrorToast(error, "Error while fetching project patches");
  usePolling<ProjectPatchesQuery, ProjectPatchesQueryVariables>({
    startPolling,
    stopPolling,
    refetch,
  });
  const { displayName, patches } = data?.project ?? {};

  return (
    <>
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
      <ProjectBanner projectIdentifier={projectIdentifier} />
      <PatchesPage
        filterComp={
          <>
            <ProjectSelect
              getProjectRoute={getProjectPatchesRoute}
              onSubmit={(p) => {
                analytics.sendEvent({
                  name: "Changed project",
                  "project.identifier": p,
                });
              }}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              selectedProjectIdentifier={projectIdentifier}
              showLabel={false}
            />
            <GitHubMergeQueueCheckbox
              checked={isGitHubMergeQueueCheckboxChecked}
              data-cy="github-merge-queue-checkbox"
              label="Only show GitHub Merge Queue patches"
              onChange={gitHubMergeQueueCheckboxOnChange}
            />
          </>
        }
        loading={loading}
        pageTitle={`${displayName ?? ""} Patches`}
        pageType="project"
        patches={patches}
      />
    </>
  );
};

const GitHubMergeQueueCheckbox = styled(Checkbox)`
  justify-content: flex-end;
`;
