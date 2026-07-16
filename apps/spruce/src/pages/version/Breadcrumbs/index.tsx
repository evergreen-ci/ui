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
  const breadcrumbRoot = useBreadcrumbRoot(
    isPatch,
    user,
    projectMetadata?.identifier || projectMetadata?.id || "",
  );
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const patchBreadcrumb = {
    "data-cy": "bc-patch",
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        link: "version",
        name: "Clicked link",
      });
    },
    text: `Patch ${patchNumber}`,
  };

  const commitBreadcrumb = {
    "data-cy": "bc-version",
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        link: "version",
        name: "Clicked link",
      });
    },
    text: shortenGithash(revision),
  };

  const breadcrumbs: Breadcrumb[] = [
    breadcrumbRoot as Breadcrumb,
    isPatch ? patchBreadcrumb : commitBreadcrumb,
  ];

  return <Breadcrumbs breadcrumbs={breadcrumbs} />;
};

export default VersionPageBreadcrumbs;
