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
import { useLastPassingTask } from "hooks/useLastPassingTask";

interface Props {
  taskId: string;
  isPopup?: boolean;
}

export const Stepback: React.FC<Props> = ({ isPopup = false, taskId }) => {
  // TODO DEVPROD-27824: Remove fetch policy when cache performance is fixed.
  const fetchPolicy = isPopup ? "no-cache" : undefined;

  const { loading: breakingTaskLoading, task: breakingTask } = useBreakingTask(
    taskId,
    fetchPolicy,
  );
  const { loading: lastPassingTaskLoading, task: lastPassingTask } =
    useLastPassingTask(taskId, fetchPolicy);

  const isLoading = breakingTaskLoading || lastPassingTaskLoading;

  // If the last passing task is undefined, it means the task is the breaking task.
  const isBreakingTask = lastPassingTask === undefined;

  // The stepback is finished if there is a breaking task or we are on the last stepback task.
  const finished = breakingTask !== undefined || isBreakingTask;

  return (
    <StepbackWrapper data-cy="stepback-info">
      <StepbackLabel>
        <b>Stepback: </b>
        {!isPopup && (
          <InfoSprinkle baseFontSize={BaseFontSize.Body1}>
            When Stepback is completed you can access the breaking commit via
            the relevant commits dropdown.
          </InfoSprinkle>
        )}
        {(() => {
          if (isLoading) {
            return <Skeleton size={SkeletonSize.Small} />;
          } else if (!finished) {
            return <Badge variant={BadgeVariant.LightGray}>In progress</Badge>;
          } else if (finished) {
            return <Badge variant={BadgeVariant.Green}>Complete</Badge>;
          }
          return null;
        })()}
      </StepbackLabel>
      {isPopup && (
        <Button
          as={Link}
          css={css`
            align-self: flex-start;
          `}
          data-cy="go-to-breaking-task-button"
          disabled={isLoading || !finished || !breakingTask}
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
    </StepbackWrapper>
  );
};

const StepbackWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};
`;

const StepbackLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
`;
