import { useQuery } from "@apollo/client";
import { useParams, Navigate } from "react-router";
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
} from "gql/generated/types";
import { PATCH_CONFIGURE } from "gql/queries";
import { PageDoesNotExist } from "pages/NotFound";
import { validateObjectId } from "utils/validators";
import ConfigurePatchCore from "./configurePatchCore";

const ConfigurePatch: React.FC = () => {
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
      <ConfigurePatchCore patch={patch} />
    </PageWrapper>
  );
};

export default ConfigurePatch;
