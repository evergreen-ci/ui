import { useState, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useParams, Navigate } from "react-router-dom";
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
import { getPatchRoute, slugs } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  VersionQuery,
  VersionQueryVariables,
  IsPatchConfiguredQuery,
  IsPatchConfiguredQueryVariables,
  HasVersionQuery,
  HasVersionQueryVariables,
} from "gql/generated/types";
import { VERSION, IS_PATCH_CONFIGURED, HAS_VERSION } from "gql/queries";
import { useSpruceConfig } from "hooks";
import { PageDoesNotExist } from "pages/NotFound";
import { isPatchUnconfigured } from "utils/patch";
import { shortenGithash, githubPRLinkify } from "utils/string";
import { jiraLinkify } from "utils/string/jiraLinkify";
import { WarningBanner, ErrorBanner, IgnoredBanner } from "./version/Banners";
import VersionPageBreadcrumbs from "./version/Breadcrumbs";
import BuildVariantCard from "./version/BuildVariantCard";
import { ActionButtons, Metadata, VersionTabs } from "./version/index";
import { NameChangeModal } from "./version/NameChangeModal";

// IMPORTANT: If you make any changes to the state logic in this file, please make sure to update the ADR:
// docs/decisions/2023-12-13_version_page_logic.md
export const VersionPage: React.FC = () => {
  const spruceConfig = useSpruceConfig();
  const { [slugs.versionId]: versionId } = useParams();
  const dispatchToast = useToastContext();

  const [redirectURL, setRedirectURL] = useState(undefined);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // This query is used to fetch the version data.
  const [getVersion, { data: versionData, error: versionError }] = useLazyQuery<
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
      setIsLoadingData(false);
    },
  });

  // If the version is a patch, we need to check if it's been configured.
  const [getPatch, { data: patchData, error: patchError }] = useLazyQuery<
    IsPatchConfiguredQuery,
    IsPatchConfiguredQueryVariables
  >(IS_PATCH_CONFIGURED, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: versionId },
    onError: (error) => {
      dispatchToast.error(
        `There was an error loading this patch: ${error.message}`,
      );
      setIsLoadingData(false);
    },
  });

  // This query checks if the provided id has a configured version.
  const { error: hasVersionError } = useQuery<
    HasVersionQuery,
    HasVersionQueryVariables
  >(HAS_VERSION, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: versionId },
    onCompleted: ({ hasVersion }) => {
      setIsLoadingData(true);
      if (hasVersion) {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        getVersion({ variables: { id: versionId } });
      } else {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        getPatch({ variables: { id: versionId } });
      }
    },
    onError: (error) => {
      dispatchToast.error(error.message);
      setIsLoadingData(false);
    },
  });

  // Decide where to redirect the user based off of whether or not the patch has been activated.
  // If the patch is activated, we can safely fetch the associated version.
  useEffect(() => {
    if (patchData) {
      const { patch } = patchData;
      const { activated, alias } = patch;
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      if (isPatchUnconfigured({ alias, activated })) {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        setRedirectURL(getPatchRoute(versionId, { configure: true }));
        setIsLoadingData(false);
      } else {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        getVersion({ variables: { id: versionId } });
      }
    }
  }, [patchData, getVersion, versionId]);

  // If we have successfully loaded a version, we can show the page.
  useEffect(() => {
    if (versionData) {
      setIsLoadingData(false);
    }
  }, [versionData]);

  if (isLoadingData) {
    return <PatchAndTaskFullPageLoad />;
  }

  if (hasVersionError || patchError || versionError) {
    return (
      <PageWrapper data-cy="version-page">
        <PageDoesNotExist />
      </PageWrapper>
    );
  }

  // If it's a patch, redirect to the proper page.
  if (redirectURL) {
    return <Navigate replace to={redirectURL} />;
  }

  // If it's a version, proceed with loading the version page.
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
        <PageLayout>
          <PageContent>
            <VersionTabs
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              version={version}
            />
          </PageContent>
        </PageLayout>
      </PageLayout>
    </PageWrapper>
  );
};
