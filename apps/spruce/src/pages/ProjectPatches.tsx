import { useQuery } from "@apollo/client";
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
  const [isCommitQueueCheckboxChecked] = useQueryParam(
    PatchPageQueryParams.CommitQueue,
    Cookies.get(INCLUDE_COMMIT_QUEUE_PROJECT_PATCHES) === "true",
  );

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
        onlyCommitQueue: isCommitQueueCheckboxChecked,
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
        loading={loading}
        pageTitle={`${displayName ?? ""} Patches`}
        pageType="project"
        filterComp={
          <ProjectSelect
            getRoute={getProjectPatchesRoute}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            selectedProjectIdentifier={projectIdentifier}
            showLabel={false}
            onSubmit={(p) => {
              analytics.sendEvent({
                name: "Changed project",
                projectIdentifier: p,
              });
            }}
          />
        }
        patches={patches}
      />
    </>
  );
};
