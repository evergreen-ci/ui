import styled from "@emotion/styled";
import {
  Align,
  Justify,
  Tooltip,
  TooltipProps,
  TriggerEvent,
} from "@leafygreen-ui/tooltip";
import Icon from "../Icon";

interface IconWithTooltipProps extends React.ComponentProps<typeof Icon> {
  ["data-testid"]?: string;
}

const IconWithTooltip: React.FC<IconWithTooltipProps> = ({
  children,
  "data-testid": dataTestId,
  ...rest
}) => (
  <StyledTooltip
    align={Align.Top}
    justify={Justify.Middle}
    trigger={
      <IconWrapper data-testid={dataTestId}>
        <Icon {...rest} />
      </IconWrapper>
    }
    triggerEvent={TriggerEvent.Hover}
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
