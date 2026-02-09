import { Size as ButtonSize } from "@leafygreen-ui/button";
import { Icon } from "@leafygreen-ui/icon";
import { Menu, MenuItem, MenuProps } from "@leafygreen-ui/menu";
import {
  LoadingButton,
  LoadingButtonProps,
} from "components/Buttons/LoadingButton";

type Props = {
  children?: React.ReactNode;
  disabled?: boolean;
  "data-cy"?: string;
  dropdownItems?: React.ReactNode[];
  loading?: boolean;
  size?: ButtonSize;
  triggerProps?: LoadingButtonProps & Record<`data-${string}`, string>;
} & Omit<MenuProps, "children" | "refEl" | "trigger">;

export const ButtonDropdown: React.FC<Props> = ({
  children,
  "data-cy": dataCy = "ellipsis-btn",
  disabled = false,
  dropdownItems,
  loading = false,
  open = undefined,
  setOpen = undefined,
  size = "small",
  triggerProps,
  ...menuProps
}) => (
  <Menu
    adjustOnMutation
    data-cy="card-dropdown"
    open={open}
    setOpen={setOpen}
    {...menuProps}
    trigger={
      <LoadingButton
        data-cy={dataCy}
        disabled={disabled}
        loading={loading}
        size={size}
        {...triggerProps}
      >
        <Icon glyph="Ellipsis" />
      </LoadingButton>
    }
  >
    {dropdownItems ?? children}
  </Menu>
);

export const DropdownItem = MenuItem;
