import { useQuery } from "@apollo/client";
import { useParams, Navigate } from "react-router-dom";
import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks/usePageVisibilityAnalytics";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { ProjectBanner } from "components/Banners";
import { PatchAndTaskFullPageLoad } from "components/Loading/PatchAndTaskFullPageLoad";
import { PageWrapper } from "components/styles";
import { mergeQueueAlias } from "constants/patch";
import { getVersionRoute, slugs } from "constants/routes";
import {
  ConfigurePatchQuery,
  ConfigurePatchQueryVariables,
  PatchConfigureGeneratedTaskCountsQuery,
  PatchConfigureGeneratedTaskCountsQueryVariables,
} from "gql/generated/types";
import {
  PATCH_CONFIGURE,
  PATCH_CONFIGURE_GENERATED_TASK_COUNTS,
} from "gql/queries";
import { PageDoesNotExist } from "pages/NotFound";
import { validateObjectId } from "utils/validators";
import ConfigurePatchCore from "./configurePatchCore";

const ConfigurePatch: React.FC = () => {
  usePageVisibilityAnalytics({ identifier: "ConfigurePatch" });
  const { [slugs.patchId]: patchId } = useParams();
  const dispatchToast = useToastContext();

  const isValidPatchId = validateObjectId(patchId || "");
  const { data, error, loading } = useQuery<
    ConfigurePatchQuery,
    ConfigurePatchQueryVariables
  >(PATCH_CONFIGURE, {
    skip: !isValidPatchId,
    variables: { id: patchId || "" },
    onError(err) {
      dispatchToast.error(err.message);
    },
  });

  const { data: generatedTaskCountsData, loading: loadingGeneratedTaskCounts } =
    useQuery<
      PatchConfigureGeneratedTaskCountsQuery,
      PatchConfigureGeneratedTaskCountsQueryVariables
    >(PATCH_CONFIGURE_GENERATED_TASK_COUNTS, {
      variables: { patchId: patchId || "" },
      skip: !isValidPatchId,
      onError(err) {
        dispatchToast.error(
          `Error fetching generated task counts: ${err.message}`,
        );
      },
    });
  const { generatedTaskCounts } = generatedTaskCountsData?.patch || {
    generatedTaskCounts: [],
  };

  const { patch } = data || {};
  usePageTitle(`Configure Patch`);

  // Can't configure a non-patch so should redirect to the version page
  if (!isValidPatchId) {
    return <Navigate to={getVersionRoute(patchId || "")} />;
  }
  if (loading) {
    return <PatchAndTaskFullPageLoad />;
  }
  if (error || !patch) {
    return <PageDoesNotExist />;
  }

  if (patch.alias === mergeQueueAlias) {
    return <Navigate to={getVersionRoute(patch.id)} />;
  }

  return (
    <PageWrapper>
      <ProjectBanner projectIdentifier={patch?.projectIdentifier} />
      <ConfigurePatchCore
        generatedTaskCounts={generatedTaskCounts}
        loadingGeneratedTaskCounts={loadingGeneratedTaskCounts}
        patch={patch}
      />
    </PageWrapper>
  );
};

export default ConfigurePatch;
