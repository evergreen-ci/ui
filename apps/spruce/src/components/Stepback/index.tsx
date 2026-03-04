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
  taskId: string;
  isPopup?: boolean;
}

export const Stepback: React.FC<StepbackProps> = ({
  isPopup = false,
  taskId,
}) => {
  // TODO DEVPROD-27824: Remove fetch policy when cache performance is fixed.
  const fetchPolicy = isPopup ? "no-cache" : undefined;

  const {
    isBreakingTask,
    loading,
    task: breakingTask,
  } = useBreakingTask(taskId, fetchPolicy);

  // Stepback is finished if there is a breaking task or we are on the last stepback task.
  const finished = breakingTask !== undefined || isBreakingTask;

  return (
    <>
      <StepbackLabel>
        <BoldLabel>Stepback: </BoldLabel>
        {!isPopup && (
          <InfoSprinkle baseFontSize={BaseFontSize.Body1}>
            When Stepback is completed you can access the breaking commit via
            the relevant commits dropdown.
          </InfoSprinkle>
        )}
        <StepbackStatus finished={finished} isLoading={loading} />
      </StepbackLabel>
      {isPopup && (
        <Button
          as={Link}
          css={css`
            align-self: flex-start;
          `}
          data-cy="go-to-breaking-task-button"
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
    </>
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
