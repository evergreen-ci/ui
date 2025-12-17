import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { TTLInfo } from "components/404/TTLInfo";
import { ProjectBanner } from "components/Banners";
import { PatchAndTaskFullPageLoad } from "components/Loading/PatchAndTaskFullPageLoad";
import PageTitle from "components/PageTitle";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import {
  PageWrapper,
  PageContent,
  PageLayout,
  PageSider,
} from "components/styles";
import { Requester } from "constants/requesters";
import { slugs } from "constants/routes";
import { VersionQuery, VersionQueryVariables } from "gql/generated/types";
import { VERSION } from "gql/queries";
import { useErrorToast, usePolling, useSpruceConfig } from "hooks";
import { PageDoesNotExist } from "pages/NotFound";
import { PatchTasksQueryParams } from "types/task";
import { githubPRLinkify, jiraLinkify } from "utils/string";
import { ActionButtons } from "./version/ActionButtons";
import { WarningBanner, ErrorBanner, IgnoredBanner } from "./version/Banners";
import VersionPageBreadcrumbs from "./version/Breadcrumbs";
import BuildVariantCard from "./version/BuildVariantCard";
import { Metadata } from "./version/Metadata";
import { NameChangeModal } from "./version/NameChangeModal";
import VersionTabs from "./version/Tabs";

export const VersionPage: React.FC = () => {
  const spruceConfig = useSpruceConfig();
  const { [slugs.versionId]: versionId = "" } = useParams();
  const [includeNeverActivatedTasks] = useQueryParam<boolean | undefined>(
    PatchTasksQueryParams.IncludeNeverActivatedTasks,
    undefined,
  );
  const {
    data: versionData,
    error,
    loading: versionLoading,
    refetch,
    startPolling,
    stopPolling,
  } = useQuery<VersionQuery, VersionQueryVariables>(VERSION, {
    variables: { id: versionId, includeNeverActivatedTasks },
    fetchPolicy: "cache-and-network",
  });
  useErrorToast(error, "There was an error loading the version");

  usePolling({ startPolling, stopPolling, refetch });

  const [activeTaskIds, setActiveTaskIds] = useState<string[]>([]);

  if (!versionData && versionLoading) {
    return <PatchAndTaskFullPageLoad />;
  }

  if (!versionData) {
    return (
      <PageWrapper data-cy="version-page" omitPadding>
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
    projectIdentifier,
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
    <PageWrapper data-cy="version-page">
      <ProjectBanner projectIdentifier={projectIdentifier} />
      {errors && errors.length > 0 && <ErrorBanner errors={errors} />}
      {warnings && warnings.length > 0 && <WarningBanner warnings={warnings} />}
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
            isMergeQueuePatch={requester === Requester.GitHubMergeQueue}
            isPatch={!!isPatch}
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
          <VersionTabs setActiveTaskIds={setActiveTaskIds} version={version} />
        </PageContent>
      </PageLayout>
    </PageWrapper>
  );
};
