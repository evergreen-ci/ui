import { shortenGithash } from "@evg-ui/lib/utils";
import { useBreadcrumbAnalytics } from "analytics";
import Breadcrumbs, { Breadcrumb } from "components/Breadcrumbs";
import { useBreadcrumbRoot } from "hooks";

interface VersionPageBreadcrumbsProps {
  patchNumber?: number;
  versionMetadata: {
    id: string;
    revision: string;
    project: string;
    isPatch: boolean;
    user: {
      userId: string;
      displayName?: string | null;
    };
    projectIdentifier: string;
    message: string;
  };
}

const VersionPageBreadcrumbs: React.FC<VersionPageBreadcrumbsProps> = ({
  patchNumber,
  versionMetadata,
}) => {
  const { isPatch, projectIdentifier, revision, user } = versionMetadata;
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
