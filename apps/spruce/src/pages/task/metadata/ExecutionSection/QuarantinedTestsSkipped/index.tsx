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
  taskId: string;
  testSelectionEnabled: boolean;
};

export const QuarantinedTestsSkipped: React.FC<Props> = ({
  count,
  execution,
  taskId,
  testSelectionEnabled,
}) => {
  const { sendEvent } = useTaskAnalytics();

  // A zero count is only meaningful as a trust signal when test selection
  // actually ran on this task.
  if (count === 0 && !testSelectionEnabled) {
    return null;
  }

  return (
    <MetadataItem as="div" label="Quarantined test skips">
      <BadgeWrapper data-cy="quarantined-test-skips">
        <InfoSprinkle baseFontSize={BaseFontSize.Body1}>
          Tests skipped on this execution because they were quarantined in TSS
          when it ran. This is an execution-time snapshot, not the live
          quarantine state.
        </InfoSprinkle>
        {count === 0 ? (
          <Badge
            data-cy="quarantined-test-skips-badge"
            variant={BadgeVariant.Green}
          >
            0
          </Badge>
        ) : (
          <StyledRouterLink
            data-cy="quarantined-test-skips-link"
            onClick={() =>
              sendEvent({
                name: "Clicked quarantined test skips metadata link",
              })
            }
            to={getTaskRoute(taskId, {
              execution,
              tab: TaskTab.Tests,
              [QueryParams.QuarantinedTests]: true,
            })}
          >
            <Badge
              data-cy="quarantined-test-skips-badge"
              variant={BadgeVariant.Yellow}
            >
              {count}
            </Badge>
          </StyledRouterLink>
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
