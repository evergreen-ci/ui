import { shortenGithash } from "@evg-ui/lib/utils/string";
import { useBreadcrumbAnalytics } from "analytics";
import Breadcrumbs, { Breadcrumb } from "components/Breadcrumbs";
import { useBreadcrumbRoot } from "hooks";

interface VersionPageBreadcrumbsProps {
  patchNumber?: number;
  versionMetadata: {
    id: string;
    revision: string;
    isPatch: boolean;
    user: {
      userId: string;
      displayName?: string | null;
    };
    projectMetadata?: {
      id: string;
      identifier: string;
    } | null;
    message: string;
  };
}

const VersionPageBreadcrumbs: React.FC<VersionPageBreadcrumbsProps> = ({
  patchNumber,
  versionMetadata,
}) => {
  const { isPatch, projectMetadata, revision, user } = versionMetadata;
  const projectIdentifier =
    projectMetadata?.identifier || projectMetadata?.id || "";
  const breadcrumbRoot = useBreadcrumbRoot(isPatch, user, projectIdentifier);
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const patchBreadcrumb = {
    text: `Patch ${patchNumber}`,
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        name: "Clicked link",
        link: "version",
      });
    },
    "data-cy": "bc-patch",
  };

  const commitBreadcrumb = {
    text: shortenGithash(revision),
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        name: "Clicked link",
        link: "version",
      });
    },
    "data-cy": "bc-version",
  };

  const breadcrumbs: Breadcrumb[] = [
    breadcrumbRoot as Breadcrumb,
    isPatch ? patchBreadcrumb : commitBreadcrumb,
  ];

  return <Breadcrumbs breadcrumbs={breadcrumbs} />;
};

export default VersionPageBreadcrumbs;
