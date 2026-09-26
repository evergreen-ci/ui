import { skipToken, useQuery } from "@apollo/client/react";
import { Checkbox } from "@via-ds/components";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { useErrorToast, useQueryParam } from "@evg-ui/lib/hooks";
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
import styles from "./ProjectPatches.module.css";

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

  const gitHubMergeQueueCheckboxOnChange = (isSelected: boolean): void => {
    setIsGitHubMergeQueueCheckboxChecked(isSelected);
    Cookies.set(
      INCLUDE_COMMIT_QUEUE_PROJECT_PATCHES,
      isSelected ? "true" : "false",
    );
    analytics.sendEvent({
      name: "Filtered for patches",
      "filter.commit_queue": isSelected,
    });
  };

  const patchesInput = usePatchesQueryParams();

  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    ProjectPatchesQuery,
    ProjectPatchesQueryVariables
  >(
    PROJECT_PATCHES,
    projectIdentifier
      ? {
          variables: {
            projectIdentifier: projectIdentifier,
            patchesInput: {
              ...patchesInput,
              onlyMergeQueue: isGitHubMergeQueueCheckboxChecked,
            },
          },
          pollInterval: DEFAULT_POLL_INTERVAL,
        }
      : skipToken,
  );
  useErrorToast(error, "Error while fetching project patches");
  usePolling<ProjectPatchesQuery, ProjectPatchesQueryVariables>({
    startPolling,
    stopPolling,
    refetch,
  });

  const { displayName, patches } = data?.project ?? {};

  return (
    <>
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
            <Checkbox
              className={styles.mergeQueueCheckbox}
              data-testid="github-merge-queue-checkbox"
              isSelected={isGitHubMergeQueueCheckboxChecked}
              onChange={gitHubMergeQueueCheckboxOnChange}
            >
              Only show GitHub Merge Queue patches
            </Checkbox>
          </>
        }
        loading={loading && !patches}
        pageTitle={`${displayName ?? ""} Patches`}
        pageType="project"
        patches={patches}
      />
    </>
  );
};
