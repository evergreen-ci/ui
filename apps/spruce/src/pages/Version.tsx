import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { TTLInfo } from "components/404/TTLInfo";
import { ErrorBanner, ProjectBanner, WarningBanner } from "components/Banners";
import { PatchAndTaskFullPageLoad } from "components/Loading/PatchAndTaskFullPageLoad";
import PageTitle from "components/PageTitle";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import {
  PageContent,
  PageLayout,
  PageSider,
  PageWrapper,
} from "components/styles";
import { slugs } from "constants/routes";
import { VersionQuery, VersionQueryVariables } from "gql/generated/types";
import { VERSION } from "gql/queries";
import { usePolling, useSpruceConfig } from "hooks";
import { PageDoesNotExist } from "pages/NotFound";
import { githubPRLinkify, jiraLinkify } from "utils/string";
import { ActionButtons } from "./version/ActionButtons";
import VersionPageBreadcrumbs from "./version/Breadcrumbs";
import BuildVariantCard from "./version/BuildVariantCard";
import { IgnoredBanner } from "./version/IgnoredBanner";
import { Metadata } from "./version/Metadata";
import { NameChangeModal } from "./version/NameChangeModal";
import VersionTabs from "./version/Tabs";
import { TaskSelectionProvider } from "./version/TaskSelection";

export const VersionPage: React.FC = () => {
  const spruceConfig = useSpruceConfig();
  const { [slugs.versionId]: versionId = "" } = useParams();
  const {
    data: versionData,
    error,
    loading: versionLoading,
    refetch,
    startPolling,
    stopPolling,
  } = useQuery<VersionQuery, VersionQueryVariables>(VERSION, {
    variables: { id: versionId },
    fetchPolicy: "cache-and-network",
  });
  useErrorToast(error, "There was an error loading the version");

  usePolling<VersionQuery, VersionQueryVariables>({
    startPolling,
    stopPolling,
    refetch,
  });

  // Patches and mainline share the /version route, so stamp is_patch to let
  // page views be split by type.
  useEffect(() => {
    const { AttributeStore } = window;
    const isPatch = versionData?.version?.isPatch;
    if (!AttributeStore || isPatch === undefined) {
      return;
    }
    AttributeStore.setGlobalAttribute("version.is_patch", isPatch);
    return () => {
      AttributeStore.removeGlobalAttribute("version.is_patch");
    };
  }, [versionData?.version?.isPatch]);

  const [activeTaskIds, setActiveTaskIds] = useState<string[]>([]);

  if (!versionData && versionLoading) {
    return <PatchAndTaskFullPageLoad />;
  }

  if (!versionData) {
    return (
      <PageWrapper data-testid="version-page" omitPadding>
        <TTLInfo>
          <PageDoesNotExist />
        </TTLInfo>
      </PageWrapper>
    );
  }

  const { version } = versionData;
  const {
    errors,
    ignored,
    isPatch,
    message,
    order,
    patch,
    projectMetadata,
    requester,
    revision,
    status,
    warnings,
  } = version || {};
  const { patchNumber } = patch || {};
  const versionText = shortenGithash(revision || versionId);
  const pageTitle = isPatch
    ? `Patch - ${patchNumber}`
    : `Version - ${versionText}`;

  const linkifiedMessage = jiraLinkify(
    githubPRLinkify(message),
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    spruceConfig?.jira?.host,
  );

  return (
    <TaskSelectionProvider versionId={versionId}>
      <PageWrapper data-testid="version-page">
        <ProjectBanner projectIdentifier={projectMetadata?.identifier} />
        {errors && errors.length > 0 && <ErrorBanner errors={errors} />}
        {warnings && warnings.length > 0 && (
          <WarningBanner warnings={warnings} />
        )}
        {ignored && <IgnoredBanner />}
        {version && (
          <VersionPageBreadcrumbs
            patchNumber={patchNumber}
            versionMetadata={version}
          />
        )}
        <PageTitle
          badge={<PatchStatusBadge status={status} />}
          buttons={
            <ActionButtons
              activeTaskIds={activeTaskIds}
              isPatch={!!isPatch}
              requester={requester}
              versionId={versionId}
            />
          }
          loading={false}
          pageTitle={pageTitle}
          title={linkifiedMessage || `Version ${order}`}
        >
          {isPatch && (
            <NameChangeModal originalPatchName={message} patchId={versionId} />
          )}
        </PageTitle>
        <PageLayout hasSider>
          <PageSider>
            <Metadata version={version} />
            <BuildVariantCard versionId={versionId} />
          </PageSider>
          <PageContent>
            <VersionTabs
              setActiveTaskIds={setActiveTaskIds}
              version={version}
            />
          </PageContent>
        </PageLayout>
      </PageWrapper>
    </TaskSelectionProvider>
  );
};
