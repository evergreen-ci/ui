import { useQuery } from "@apollo/client";
import { useParams, Navigate } from "react-router-dom";
import { ProjectBanner } from "components/Banners";
import { PatchAndTaskFullPageLoad } from "components/Loading/PatchAndTaskFullPageLoad";
import { PageWrapper } from "components/styles";
import { commitQueueAlias } from "constants/patch";
import { getVersionRoute, slugs } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  ConfigurePatchQuery,
  ConfigurePatchQueryVariables,
} from "gql/generated/types";
import { PATCH_CONFIGURE } from "gql/queries";
import { usePageTitle } from "hooks";
import { PageDoesNotExist } from "pages/NotFound";
import { validateObjectId } from "utils/validators";
import ConfigurePatchCore from "./configurePatchCore";

const ConfigurePatch: React.FC = () => {
  const { [slugs.patchId]: patchId } = useParams();
  const dispatchToast = useToastContext();
  const { data, error, loading } = useQuery<
    ConfigurePatchQuery,
    ConfigurePatchQueryVariables
  >(PATCH_CONFIGURE, {
    variables: { id: patchId },
    onError(err) {
      dispatchToast.error(err.message);
    },
  });

  const { patch } = data || {};
  usePageTitle(`Configure Patch`);

  // Can't configure a mainline version so should redirect to the version page
  if (!validateObjectId(patchId)) {
    return <Navigate to={getVersionRoute(patchId)} />;
  }

  if (loading) {
    return <PatchAndTaskFullPageLoad />;
  }
  if (error) {
    return <PageDoesNotExist />;
  }

  if (patch.alias === commitQueueAlias) {
    return <Navigate to={getVersionRoute(patchId)} />;
  }

  return (
    <PageWrapper>
      <ProjectBanner projectIdentifier={patch?.projectIdentifier} />
      <ConfigurePatchCore patch={patch} />
    </PageWrapper>
  );
};

export default ConfigurePatch;
