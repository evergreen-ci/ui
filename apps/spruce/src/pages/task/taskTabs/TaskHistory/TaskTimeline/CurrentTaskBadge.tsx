import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";

const { blue } = palette;

interface CurrentTaskBadgeProps {
  isCurrentTask: boolean;
}

export const CurrentTaskBadge: React.FC<CurrentTaskBadgeProps> = ({
  isCurrentTask,
}) =>
  isCurrentTask ? (
    <>
      <StyledBadge className="current-task-badge" variant="blue">
        This Task
      </StyledBadge>
      <Dot className="current-task-dot" />
    </>
  ) : null;

const StyledBadge = styled(Badge)`
  position: absolute;
  top: 160%;
  left: -170%;
  min-width: 80px;
`;

const Dot = styled.div`
  position: absolute;
  top: 120%;
  left: 40%;

  height: ${size.xxs};
  width: ${size.xxs};
  border-radius: ${size.m};
  background-color: ${blue.light1};
`;
