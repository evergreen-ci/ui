import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useToastContext } from "@evg-ui/lib/context/toast";
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
import {
  VersionQuery,
  VersionQueryVariables,
  VersionStatusQuery,
  VersionStatusQueryVariables,
} from "gql/generated/types";
import { VERSION, VERSION_STATUS } from "gql/queries";
import { usePolling, useSpruceConfig } from "hooks";
import { PageDoesNotExist } from "pages/NotFound";
import { shortenGithash, githubPRLinkify, jiraLinkify } from "utils/string";
import { ActionButtons } from "./version/ActionButtons";
import { WarningBanner, ErrorBanner, IgnoredBanner } from "./version/Banners";
import VersionPageBreadcrumbs from "./version/Breadcrumbs";
import BuildVariantCard from "./version/BuildVariantCard";
import { Metadata } from "./version/Metadata";
import { NameChangeModal } from "./version/NameChangeModal";
import VersionTabs from "./version/Tabs";

export const VersionPage: React.FC = () => {
  const spruceConfig = useSpruceConfig();
  const { [slugs.versionId]: versionId } = useParams();
  const dispatchToast = useToastContext();

  // This query is used to fetch the version data.
  const { data: versionData, error: versionError } = useQuery<
    VersionQuery,
    VersionQueryVariables
  >(VERSION, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: versionId },
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      dispatchToast.error(
        `There was an error loading the version: ${error.message}`,
      );
    },
  });

  const {
    data: versionStatusData,
    error: versionStatusError,
    refetch,
    startPolling,
    stopPolling,
  } = useQuery<VersionStatusQuery, VersionStatusQueryVariables>(
    VERSION_STATUS,
    {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      variables: { id: versionId },
      fetchPolicy: "cache-and-network",
    },
  );

  usePolling({ startPolling, stopPolling, refetch });

  if (versionError || versionStatusError) {
    return (
      <PageWrapper data-cy="version-page">
        <PageDoesNotExist />
      </PageWrapper>
    );
  }

  if (!versionData || !versionStatusData) {
    return <PatchAndTaskFullPageLoad />;
  }

  const { version } = versionData || {};
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
    warnings,
  } = version || {};
  const { patchNumber } = patch || {};
  const { status } = versionStatusData.version || {};

  // @ts-expect-error: FIXME. This comment was added by an automated script.
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
            canReconfigure={
              !!isPatch && requester !== Requester.GitHubMergeQueue
            }
            isPatch={!!isPatch}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            versionId={versionId}
          />
        }
        loading={false}
        pageTitle={pageTitle}
        title={linkifiedMessage || `Version ${order}`}
      >
        {isPatch && (
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          <NameChangeModal originalPatchName={message} patchId={versionId} />
        )}
      </PageTitle>
      <PageLayout hasSider>
        <PageSider>
          <Metadata loading={false} version={version} />
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <BuildVariantCard versionId={versionId} />
        </PageSider>
        <PageContent>
          <VersionTabs version={version} />
        </PageContent>
      </PageLayout>
    </PageWrapper>
  );
};
