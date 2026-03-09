import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Badge, Variant as BadgeVariant } from "@leafygreen-ui/badge";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { Skeleton, Size as SkeletonSize } from "@leafygreen-ui/skeleton-loader";
import { BaseFontSize } from "@leafygreen-ui/tokens";
import { Link } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { getTaskRoute } from "constants/routes";
import { useBreakingTask } from "hooks/useBreakingTask";

interface StepbackStatusProps {
  finished: boolean;
  isLoading: boolean;
}

const StepbackStatus: React.FC<StepbackStatusProps> = ({
  finished,
  isLoading,
}) => {
  if (isLoading) {
    return <Skeleton size={SkeletonSize.Small} />;
  }
  if (!finished) {
    return <Badge variant={BadgeVariant.LightGray}>In progress</Badge>;
  }
  return <Badge variant={BadgeVariant.Green}>Complete</Badge>;
};

interface StepbackProps {
  isPopup?: boolean;
  taskId: string;
}

export const Stepback: React.FC<StepbackProps> = ({
  isPopup = false,
  taskId,
}) => {
  // TODO DEVPROD-27824: Remove fetch policy when cache performance is fixed.
  const fetchPolicy = isPopup ? "no-cache" : undefined;

  const { loading, task: breakingTask } = useBreakingTask(taskId, fetchPolicy);

  // Stepback is finished if there is a breaking task.
  const finished = breakingTask !== undefined;

  return (
    <StepbackLabel>
      <BoldLabel>Stepback: </BoldLabel>
      <StepbackStatus finished={finished} isLoading={loading} />
      {!isPopup && (
        <InfoSprinkle baseFontSize={BaseFontSize.Body1}>
          When Stepback is completed you can access the breaking commit via the
          relevant commits dropdown.
        </InfoSprinkle>
      )}
      {isPopup && (
        <Button
          as={Link}
          css={css`
            flex-shrink: 0;
          `}
          data-cy="breaking-task-button"
          disabled={loading || !finished || !breakingTask}
          size={ButtonSize.Small}
          to={
            breakingTask
              ? getTaskRoute(breakingTask.id, {
                  execution: breakingTask.execution,
                })
              : ""
          }
        >
          Go to breaking task
        </Button>
      )}
    </StepbackLabel>
  );
};

const BoldLabel = styled.b`
  flex-shrink: 0;
`;

const StepbackLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
`;
