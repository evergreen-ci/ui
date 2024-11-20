import styled from "@emotion/styled";
import { IconProps } from "@leafygreen-ui/icon";
import Tooltip from "@leafygreen-ui/tooltip";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import Icon from "components/Icon";

export type IconTooltipProps = IconProps & {
  ["data-cy"]?: string;
  children: React.ReactNode;
};

const IconTooltip: React.FC<IconTooltipProps> = ({
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

// @ts-expect-error
const StyledTooltip = styled(Tooltip)`
  max-width: 300px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default IconTooltip;
