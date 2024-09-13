import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
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
import { slugs } from "constants/routes";
import { useToastContext } from "context/toast";
import { VersionQuery, VersionQueryVariables } from "gql/generated/types";
import { VERSION } from "gql/queries";
import { useSpruceConfig } from "hooks";
import { PageDoesNotExist } from "pages/NotFound";
import { shortenGithash, githubPRLinkify } from "utils/string";
import { jiraLinkify } from "utils/string/jiraLinkify";
import { WarningBanner, ErrorBanner, IgnoredBanner } from "./version/Banners";
import VersionPageBreadcrumbs from "./version/Breadcrumbs";
import BuildVariantCard from "./version/BuildVariantCard";
import { ActionButtons, Metadata, VersionTabs } from "./version/index";
import { NameChangeModal } from "./version/NameChangeModal";

export const VersionPage: React.FC = () => {
  const spruceConfig = useSpruceConfig();
  const { [slugs.versionId]: versionId } = useParams();
  const dispatchToast = useToastContext();

  // This query is used to fetch the version data.
  const {
    data: versionData,
    error: versionError,
    loading: versionLoading,
  } = useQuery<VersionQuery, VersionQueryVariables>(VERSION, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: versionId },
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      dispatchToast.error(
        `There was an error loading the version: ${error.message}`,
      );
    },
  });

  if (versionLoading) {
    return <PatchAndTaskFullPageLoad />;
  }

  if (versionError) {
    return (
      <PageWrapper data-cy="version-page">
        <PageDoesNotExist />
      </PageWrapper>
    );
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
    revision,
    status,
    warnings,
  } = version || {};
  const { patchNumber } = patch || {};

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const versionText = shortenGithash(revision || versionId);
  const pageTitle = isPatch
    ? `Patch - ${patchNumber}`
    : `Version - ${versionText}`;

  const linkifiedMessage = jiraLinkify(
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    githubPRLinkify(message),
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    spruceConfig?.jira?.host,
  );

  return (
    <PageWrapper data-cy="version-page">
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
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
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        badge={<PatchStatusBadge status={status} />}
        buttons={
          <ActionButtons
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            canReconfigure={isPatch}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            isPatch={isPatch}
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
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <Metadata loading={false} version={version} />
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <BuildVariantCard versionId={versionId} />
        </PageSider>
        <PageContent>
          <VersionTabs
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            version={version}
          />
        </PageContent>
      </PageLayout>
    </PageWrapper>
  );
};
