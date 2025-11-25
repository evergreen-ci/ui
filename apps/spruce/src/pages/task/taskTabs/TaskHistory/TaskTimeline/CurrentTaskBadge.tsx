import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Badge, Variant as BadgeVariant } from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";

const { blue } = palette;

interface CurrentTaskBadgeProps {
  isCurrentTask: boolean;
  isPatch: boolean;
}

const CurrentTaskBadge: React.FC<CurrentTaskBadgeProps> = ({
  isCurrentTask,
  isPatch,
}) =>
  isCurrentTask ? (
    <>
      <StyledBadge className="current-task-badge" variant={BadgeVariant.Blue}>
        {isPatch ? "Base" : "This"} Task
      </StyledBadge>
      <Dot />
    </>
  ) : null;

const StyledBadge = styled(Badge)`
  position: absolute;
  top: 75%;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  min-width: 80px;
`;

const Dot = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(100%);

  height: ${size.xxs};
  width: ${size.xxs};
  border-radius: ${size.m};
  background-color: ${blue.light1};
`;

export const currentBadgeHoverStyles = css`
  .current-task-badge {
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  :hover {
    .current-task-badge {
      opacity: 1;
      pointer-events: auto;
    }
  }
`;

export default CurrentTaskBadge;
