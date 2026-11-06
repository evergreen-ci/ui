import { useBreadcrumbAnalytics } from "analytics";
import Breadcrumbs, { Breadcrumb } from "components/Breadcrumbs";
import { VersionQuery } from "gql/generated/types";
import { useBreadcrumbRoot } from "hooks";
import { getDisplayRevision } from "utils/string";

interface VersionPageBreadcrumbsProps {
  patchNumber?: number;
  versionMetadata: VersionQuery["version"];
}

const VersionPageBreadcrumbs: React.FC<VersionPageBreadcrumbsProps> = ({
  patchNumber,
  versionMetadata,
}) => {
  const { isPatch, projectMetadata, user } = versionMetadata;
  const breadcrumbRoot = useBreadcrumbRoot(
    isPatch,
    user,
    projectMetadata?.identifier || projectMetadata?.id || "",
  );
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const patchBreadcrumb = {
    text: `Patch ${patchNumber}`,
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        name: "Clicked link",
        link: "version",
      });
    },
    "data-testid": "bc-patch",
  };

  const commitBreadcrumb = {
    text: getDisplayRevision(versionMetadata),
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        name: "Clicked link",
        link: "version",
      });
    },
    "data-testid": "bc-version",
  };

  const breadcrumbs: Breadcrumb[] = [
    breadcrumbRoot as Breadcrumb,
    isPatch ? patchBreadcrumb : commitBreadcrumb,
  ];

  return <Breadcrumbs breadcrumbs={breadcrumbs} />;
};

export default VersionPageBreadcrumbs;
