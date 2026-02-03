import styled from "@emotion/styled";
import { Badge } from "@leafygreen-ui/badge";
import { Disclaimer } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
import { Link } from "react-router-dom";
import { size } from "@evg-ui/lib/constants";
import { hoverStyles } from "components/styles/SearchableDropdown";
import { getTaskQueueRoute } from "constants/routes";
import { TaskQueueDistro } from "gql/generated/types";

interface DistroOptionProps {
  option: TaskQueueDistro;
  onClick: (val: TaskQueueDistro) => void;
}

export const DistroOption: React.FC<DistroOptionProps> = ({
  onClick,
  option,
}) => {
  const { hostCount, id, taskCount } = option;
  return (
    <Link onClick={() => onClick(option)} to={getTaskQueueRoute(id)}>
      <OptionWrapper>
        <StyledBadge>{pluralize("task", taskCount, true)}</StyledBadge>
        <StyledBadge>{pluralize("host", hostCount, true)}</StyledBadge>
        <DistroName>{id}</DistroName>
      </OptionWrapper>
    </Link>
  );
};

const OptionWrapper = styled.div`
  display: flex;
  padding: ${size.xs};
  align-items: start;
  ${hoverStyles};
`;

const StyledBadge = styled(Badge)`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  width: 90px;
  margin-right: ${size.xs};
`;
const DistroName = styled(Disclaimer)`
  margin-left: ${size.s};
`;
