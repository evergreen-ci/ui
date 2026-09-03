import { Chip, ChipGroup, ChipVariant } from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { useProjectPatchesAnalytics, useUserPatchesAnalytics } from "analytics";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import { unlinkedPRUsers } from "constants/patch";
import { Requester } from "constants/requesters";
import {
  getPatchRoute,
  getProjectPatchesRoute,
  getUserPatchesRoute,
  getVersionRoute,
} from "constants/routes";
import { mapUmbrellaStatusToQueryParam } from "constants/task";
import { PatchesPagePatchesFragment } from "gql/generated/types";
import { useDateFormat } from "hooks";
import { PatchStatus } from "types/patch";
import { groupStatusesByUmbrellaStatus } from "utils/statuses";
import { DropdownMenu } from "./DropdownMenu";
import styles from "./index.module.css";

type PatchType = Unpacked<PatchesPagePatchesFragment["patches"]>;

interface PatchCardProps {
  pageType: "project" | "user";
  patch: PatchType;
}

const PatchCard: React.FC<PatchCardProps> = ({ pageType, patch }) => {
  const getDateCopy = useDateFormat();
  const userPatchesAnalytics = useUserPatchesAnalytics();
  const projectPatchesAnalytics = useProjectPatchesAnalytics();
  const analytics =
    pageType === "project" ? projectPatchesAnalytics : userPatchesAnalytics;
  const {
    activated,
    createTime,
    description,
    hidden,
    id,
    invalidatedByUpstream,
    projectMetadata,
    status,
    user,
    version,
  } = patch;
  const projectIdentifier = projectMetadata?.identifier;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const createDate = new Date(createTime);
  const { id: versionId, requester, taskStatusStats } = version || {};
  const { stats } = groupStatusesByUmbrellaStatus(
    taskStatusStats?.counts ?? [],
  );
  const isMergeQueuePatch = requester === Requester.GitHubMergeQueue;

  let patchProject;
  if (pageType === "project") {
    patchProject = unlinkedPRUsers.has(user.userId) ? (
      user.displayName
    ) : (
      <StyledRouterLink
        data-testid="user-patches-link"
        to={getUserPatchesRoute(user.userId)}
      >
        <strong>{user.displayName}</strong>
      </StyledRouterLink>
    );
  } else if (projectIdentifier) {
    patchProject = (
      <StyledRouterLink
        data-testid="project-patches-link"
        to={getProjectPatchesRoute(projectIdentifier)}
      >
        <strong>{projectIdentifier}</strong>
      </StyledRouterLink>
    );
  } else if (projectMetadata?.owner && projectMetadata?.repo) {
    patchProject = `${projectMetadata.owner}/${projectMetadata.repo}`;
  } else {
    patchProject = "Deleted project";
  }

  const badges = stats?.map(({ count, statusCounts, umbrellaStatus }) => (
    <GroupedTaskStatusBadge
      key={`${versionId}_${umbrellaStatus}`}
      count={count}
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      href={getVersionRoute(versionId, {
        statuses: mapUmbrellaStatusToQueryParam[umbrellaStatus],
      })}
      status={umbrellaStatus}
      statusCounts={statusCounts}
    />
  ));
  return (
    <div className={styles.cardWrapper} data-testid="patch-card">
      <div className={styles.left}>
        <StyledRouterLink
          className={styles.descriptionLink}
          data-testid="patch-card-patch-link"
          onClick={() => analytics.sendEvent({ name: "Clicked patch link" })}
          to={
            activated
              ? getVersionRoute(id)
              : getPatchRoute(id, { configure: true })
          }
        >
          {description || "no description"}
        </StyledRouterLink>
        <div className={styles.timeAndProject}>
          {getDateCopy(createDate)} {pageType === "project" ? "by" : "on"}{" "}
          {patchProject}
        </div>
      </div>
      <div className={styles.center}>
        <div className={styles.patchBadgeContainer}>
          <PatchStatusBadge
            status={
              activated ? (version?.status ?? status) : PatchStatus.Unconfigured
            }
          />
        </div>
        <div className={styles.taskBadgeContainer}>{badges}</div>
      </div>
      <div className={styles.right}>
        {(invalidatedByUpstream || hidden) && (
          <ChipGroup
            aria-label="Patch attributes"
            className={styles.chipContainer}
          >
            {invalidatedByUpstream && (
              <Chip id="merge-queue-aborted" variant={ChipVariant.Gray}>
                <Icon glyph="Refresh" /> Merge Queue Aborted
              </Chip>
            )}
            {hidden && (
              <Chip
                data-testid="hidden-badge"
                id="hidden"
                variant={ChipVariant.Gray}
              >
                Hidden
              </Chip>
            )}
          </ChipGroup>
        )}
        <DropdownMenu
          hasVersion={!!versionId}
          isMergeQueuePatch={isMergeQueuePatch}
          isPatchHidden={hidden}
          patchId={id}
        />
      </div>
    </div>
  );
};

export default PatchCard;
