import styled from "@emotion/styled";
import Tooltip, { TooltipProps } from "@leafygreen-ui/tooltip";
import { zIndex } from "../../constants/tokens";
import Icon from "../Icon";

interface IconWithTooltipProps extends React.ComponentProps<typeof Icon> {
  ["data-cy"]?: string;
}

const IconWithTooltip: React.FC<IconWithTooltipProps> = ({
  children,
  "data-cy": dataCy,
  ...rest
}) => (
  <StyledTooltip
    align="top"
    justify="middle"
    popoverZIndex={zIndex.tooltip}
    trigger={
      <IconWrapper data-cy={dataCy}>
        <Icon {...rest} />
      </IconWrapper>
    }
    triggerEvent="hover"
  >
    {children}
  </StyledTooltip>
);

const StyledTooltip = styled(
  Tooltip as React.ComponentType<Partial<TooltipProps>>,
)`
  max-width: 300px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default IconWithTooltip;
