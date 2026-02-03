import styled from "@emotion/styled";
import { wordBreakCss, StyledRouterLink } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { TaskStatusUmbrella } from "@evg-ui/lib/types";
import { arraySymmetricDifference } from "@evg-ui/lib/utils";
import { useVersionAnalytics } from "analytics";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { getVersionRoute } from "constants/routes";
import { mapUmbrellaStatusToQueryParam } from "constants/task";
import { StatusCount } from "gql/generated/types";
import { PatchTasksQueryParams } from "types/task";
import { string, statuses } from "utils";

const { groupStatusesByUmbrellaStatus } = statuses;
const { applyStrictRegex } = string;

interface VariantTaskGroupProps {
  displayName: string;
  statusCounts: StatusCount[];
  variant: string;
  versionId: string;
}
const VariantTaskGroup: React.FC<VariantTaskGroupProps> = ({
  displayName,
  statusCounts,
  variant,
  versionId,
}) => {
  const { sendEvent } = useVersionAnalytics(versionId);

  const [variantSearch] = useQueryParam<string | null>(
    PatchTasksQueryParams.Variant,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    undefined,
  );
  const [sorts] = useQueryParam(PatchTasksQueryParams.Sorts, undefined);
  const [statusSearch] = useQueryParam<string[] | null>(
    PatchTasksQueryParams.Statuses,
    [],
  );
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const hasStatusFilter = statusSearch.length > 0;
  const hasVariantFilter = variantSearch !== undefined;

  const isVariantSelected = variantSearch === applyStrictRegex(variant);

  const { stats } = groupStatusesByUmbrellaStatus(statusCounts ?? []);

  const versionRouteParams = {
    sorts,
    page: 0,
  };

  return (
    <div data-cy="patch-build-variant">
      <StyledRouterLink
        css={wordBreakCss}
        data-cy="build-variant-display-name"
        onClick={() =>
          sendEvent({
            name: "Filtered by build variant group",
          })
        }
        to={getVersionRoute(versionId, {
          ...versionRouteParams,
          variant: isVariantSelected ? undefined : applyStrictRegex(variant),
        })}
      >
        {displayName}
      </StyledRouterLink>

      <TaskBadgeContainer>
        {stats.map(
          ({ count, statusCounts: groupedStatusCounts, umbrellaStatus }) => {
            const hasStatusFilterForUmbrellaStatus = isUmbrellaStatusSet(
              umbrellaStatus,
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              statusSearch,
            );
            // A badge is active if the variant is selected and the status is selected
            // or if the variant is selected and there are no status filters
            // or if there are no variant filters
            const isBadgeActive =
              (isVariantSelected && hasStatusFilterForUmbrellaStatus) ||
              (isVariantSelected && !hasStatusFilter) ||
              !hasVariantFilter;
            const shouldLinkToVariant = !(
              isBadgeActive && hasStatusFilterForUmbrellaStatus
            );
            return (
              <GroupedTaskStatusBadge
                key={`${versionId}_${variant}_${umbrellaStatus}`}
                count={count}
                // If the badge is active it should reset the page.
                href={getVersionRoute(
                  versionId,
                  shouldLinkToVariant
                    ? {
                        ...versionRouteParams,
                        variant: applyStrictRegex(variant),
                        statuses: mapUmbrellaStatusToQueryParam[umbrellaStatus],
                      }
                    : { ...versionRouteParams },
                )}
                isActive={isBadgeActive}
                onClick={() => {
                  sendEvent({
                    name: "Filtered by build variant and task status group",
                    "filter.task_square_statuses":
                      Object.keys(groupedStatusCounts),
                  });
                }}
                status={umbrellaStatus}
                statusCounts={groupedStatusCounts}
              />
            );
          },
        )}
      </TaskBadgeContainer>
    </div>
  );
};

const isUmbrellaStatusSet = (
  status: TaskStatusUmbrella,
  activeStatusSearch: string[],
) =>
  arraySymmetricDifference(
    mapUmbrellaStatusToQueryParam[status],
    activeStatusSearch,
  ).length === 0;

const TaskBadgeContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: ${size.xs};
  margin-top: ${size.xs};
  margin-bottom: ${size.xs};
`;

export default VariantTaskGroup;
