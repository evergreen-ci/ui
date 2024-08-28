import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { useProjectPatchesAnalytics } from "analytics/patches/useProjectPatchesAnalytics";
import { ProjectBanner } from "components/Banners";
import { PatchesPage } from "components/PatchesPage";
import { usePatchesQueryParams } from "components/PatchesPage/usePatchesQueryParams";
import { ProjectSelect } from "components/ProjectSelect";
import { INCLUDE_COMMIT_QUEUE_PROJECT_PATCHES } from "constants/cookies";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { getProjectPatchesRoute, slugs } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  ProjectPatchesQuery,
  ProjectPatchesQueryVariables,
} from "gql/generated/types";
import { PROJECT_PATCHES } from "gql/queries";
import { usePolling } from "hooks";
import { useQueryParam } from "hooks/useQueryParam";
import { PatchPageQueryParams } from "types/patch";

export const ProjectPatches = () => {
  const dispatchToast = useToastContext();
  const analytics = useProjectPatchesAnalytics();
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();

  const [
    isGitHubMergeQueueCheckboxChecked,
    setIsGitHubMergeQueueCheckboxChecked,
  ] = useQueryParam(
    PatchPageQueryParams.CommitQueue,
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

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    ProjectPatchesQuery,
    ProjectPatchesQueryVariables
  >(PROJECT_PATCHES, {
    variables: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      projectIdentifier,
      patchesInput: {
        ...patchesInput,
        onlyCommitQueue: isGitHubMergeQueueCheckboxChecked,
      },
    },
    pollInterval: DEFAULT_POLL_INTERVAL,
    onError: (err) => {
      dispatchToast.error(
        `Error while fetching project patches: ${err.message}`,
      );
    },
  });
  usePolling({ startPolling, stopPolling, refetch });
  const { displayName, patches } = data?.project ?? {};

  return (
    <>
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
      <ProjectBanner projectIdentifier={projectIdentifier} />
      <PatchesPage
        filterComp={
          <>
            <ProjectSelect
              getRoute={getProjectPatchesRoute}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              selectedProjectIdentifier={projectIdentifier}
              showLabel={false}
              onSubmit={(p) => {
                analytics.sendEvent({
                  name: "Changed project",
                  "project.identifier": p,
                });
              }}
            />
            <GitHubMergeQueueCheckbox
              data-cy="github-merge-queue-checkbox"
              onChange={gitHubMergeQueueCheckboxOnChange}
              label="Only show GitHub Merge Queue patches"
              checked={isGitHubMergeQueueCheckboxChecked}
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

// @ts-expect-error
const GitHubMergeQueueCheckbox = styled(Checkbox)`
  justify-content: flex-end;
`;
