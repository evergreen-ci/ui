import { Align, Justify, Tooltip, TriggerEvent } from "@leafygreen-ui/tooltip";
import Icon from "../Icon";
import styles from "./index.module.css";

interface IconWithTooltipProps extends React.ComponentProps<typeof Icon> {
  ["data-testid"]?: string;
}

const IconWithTooltip: React.FC<IconWithTooltipProps> = ({
  children,
  "data-testid": dataTestId,
  ...rest
}) => (
  <Tooltip
    align={Align.Top}
    className={styles.tooltip}
    justify={Justify.Middle}
    trigger={
      <div className={styles.iconWrapper} data-testid={dataTestId}>
        <Icon {...rest} />
      </div>
    }
    triggerEvent={TriggerEvent.Hover}
  >
    {children}
  </Tooltip>
);

export default IconWithTooltip;
