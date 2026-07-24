import styled from "@emotion/styled";
import { Badge, Variant as BadgeVariant } from "@leafygreen-ui/badge";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { BaseFontSize } from "@leafygreen-ui/tokens";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useTaskAnalytics } from "analytics";
import { MetadataItem } from "components/MetadataCard";
import { getTaskRoute } from "constants/routes";
import { QueryParams, TaskTab } from "types/task";

type Props = {
  count: number;
  execution: number;
  latestExecution: number;
  taskId: string;
  testSelectionEnabled: boolean;
};

export const SkippedTestsMetadata: React.FC<Props> = ({
  count,
  execution,
  latestExecution,
  taskId,
  testSelectionEnabled,
}) => {
  const { sendEvent } = useTaskAnalytics();

  // A zero count is only meaningful as a trust signal when test selection
  // actually ran on this task.
  if (count === 0 && !testSelectionEnabled) {
    return null;
  }

  const detailsAvailable = count > 0 && execution === latestExecution;
  const badge = (
    <Badge
      data-cy="skipped-tests-metadata-badge"
      variant={count === 0 ? BadgeVariant.Green : BadgeVariant.Yellow}
    >
      {count}
    </Badge>
  );

  return (
    <MetadataItem as="div" label="Tests skipped by TSS">
      <BadgeWrapper data-cy="skipped-tests-metadata">
        <InfoSprinkle baseFontSize={BaseFontSize.Body1}>
          Tests skipped by TSS when this execution ran. This snapshot may differ
          from what TSS would skip now.
          {execution !== latestExecution &&
            " Test names are only available for the latest execution."}
        </InfoSprinkle>
        {detailsAvailable ? (
          <StyledRouterLink
            data-cy="skipped-tests-metadata-link"
            onClick={() =>
              sendEvent({
                name: "Clicked skipped tests metadata link",
              })
            }
            to={getTaskRoute(taskId, {
              execution,
              tab: TaskTab.Tests,
              [QueryParams.SkippedTests]: true,
            })}
          >
            {badge}
          </StyledRouterLink>
        ) : (
          badge
        )}
      </BadgeWrapper>
    </MetadataItem>
  );
};

const BadgeWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${size.xxs};
  vertical-align: middle;
`;
