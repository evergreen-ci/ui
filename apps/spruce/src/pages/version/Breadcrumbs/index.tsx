import { shortenGithash } from "@evg-ui/lib/utils/string";
import { useBreadcrumbAnalytics } from "analytics";
import Breadcrumbs, { Breadcrumb } from "components/Breadcrumbs";
import { VersionQuery } from "gql/generated/types";
import { useBreadcrumbRoot } from "hooks";

interface VersionPageBreadcrumbsProps {
  patchNumber?: number;
  versionMetadata?: Pick<
    VersionQuery["version"],
    | "id"
    | "revision"
    | "project"
    | "isPatch"
    | "user"
    | "projectIdentifier"
    | "message"
  >;
}

const VersionPageBreadcrumbs: React.FC<VersionPageBreadcrumbsProps> = ({
  patchNumber,
  versionMetadata,
}) => {
  const { isPatch, projectIdentifier, revision, user } = versionMetadata ?? {};
  // @ts-expect-error: FIXME. This comment was added by an automated script.
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
