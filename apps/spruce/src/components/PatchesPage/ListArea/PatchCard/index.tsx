import styled from "@emotion/styled";
import { Badge } from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { fontSize, size } from "@evg-ui/lib/constants/tokens";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { useUserPatchesAnalytics, useProjectPatchesAnalytics } from "analytics";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import { unlinkedPRUsers } from "constants/patch";
import { Requester } from "constants/requesters";
import {
  getProjectPatchesRoute,
  getVersionRoute,
  getUserPatchesRoute,
  getPatchRoute,
} from "constants/routes";
import { mapUmbrellaStatusToQueryParam } from "constants/task";
import { PatchesPagePatchesFragment } from "gql/generated/types";
import { useDateFormat } from "hooks";
import { PatchStatus } from "types/patch";
import { groupStatusesByUmbrellaStatus } from "utils/statuses";
import { DropdownMenu } from "./DropdownMenu";

type PatchType = Unpacked<PatchesPagePatchesFragment["patches"]>;
const { gray } = palette;

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
    author,
    authorDisplayName,
    createTime,
    description,
    hidden,
    id,
    projectIdentifier,
    projectMetadata,
    status,
    versionFull,
  } = patch;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const createDate = new Date(createTime);
  const { id: versionId, requester, taskStatusStats } = versionFull || {};
  const { stats } = groupStatusesByUmbrellaStatus(
    taskStatusStats?.counts ?? [],
  );
  const isMergeQueuePatch = requester === Requester.GitHubMergeQueue;

  let patchProject = null;
  if (pageType === "project") {
    patchProject = unlinkedPRUsers.has(author) ? (
      authorDisplayName
    ) : (
      <StyledRouterLink
        data-cy="user-patches-link"
        to={getUserPatchesRoute(author)}
      >
        <strong>{authorDisplayName}</strong>
      </StyledRouterLink>
    );
  } else {
    patchProject = projectIdentifier ? (
      <StyledRouterLink
        data-cy="project-patches-link"
        to={getProjectPatchesRoute(projectIdentifier)}
      >
        <strong>{projectIdentifier}</strong>
      </StyledRouterLink>
    ) : (
      `${projectMetadata?.owner}/${projectMetadata?.repo}`
    );
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
    <CardWrapper data-cy="patch-card">
      <Left>
        <DescriptionLink
          data-cy="patch-card-patch-link"
          onClick={() => analytics.sendEvent({ name: "Clicked patch link" })}
          to={
            activated
              ? getVersionRoute(id)
              : getPatchRoute(id, { configure: true })
          }
        >
          {description || "no description"}
        </DescriptionLink>
        <TimeAndProject>
          {getDateCopy(createDate)} {pageType === "project" ? "by" : "on"}{" "}
          {patchProject}
        </TimeAndProject>
      </Left>
      <Center>
        <PatchBadgeContainer>
          <PatchStatusBadge
            status={
              activated
                ? (versionFull?.status ?? status)
                : PatchStatus.Unconfigured
            }
          />
        </PatchBadgeContainer>
        <TaskBadgeContainer>{badges}</TaskBadgeContainer>
      </Center>
      <Right>
        {hidden && <Badge data-cy="hidden-badge">Hidden</Badge>}
        <DropdownMenu
          hasVersion={!!versionId}
          isMergeQueuePatch={isMergeQueuePatch}
          isPatchHidden={hidden}
          patchId={id}
        />
      </Right>
    </CardWrapper>
  );
};

const TaskBadgeContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  > * {
    margin-right: ${size.s};
  }
  flex-wrap: wrap;
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${size.s} ${size.xxs};
  border-bottom: 1px solid ${gray.light2};
`;

const Center = styled.div`
  display: flex;
  flex: 1 1 0;
`;

const Left = styled(Center)`
  flex-direction: column;
  padding-right: ${size.m};
`;

const Right = styled.div`
  width: 110px;
  display: flex;
  justify-content: flex-end;
  gap: ${size.xs};
`;

const DescriptionLink = styled(StyledRouterLink)`
  font-size: ${fontSize.l};
  font-weight: 500;
  padding-bottom: ${size.xs};
`;

const PatchBadgeContainer = styled.div`
  margin-right: ${size.m};
  min-width: ${size.xxl};
`;

const TimeAndProject = styled.div`
  color: ${gray.base};
`;

export default PatchCard;
