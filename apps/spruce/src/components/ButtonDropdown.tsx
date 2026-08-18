import { Size as ButtonSize } from "@leafygreen-ui/button";
import { Menu, MenuItem, MenuProps } from "@leafygreen-ui/menu";
import { Icon } from "@evg-ui/lib/components/Icon";
import {
  LoadingButton,
  LoadingButtonProps,
} from "components/Buttons/LoadingButton";

type Props = {
  children?: React.ReactNode;
  disabled?: boolean;
  "data-testid"?: string;
  dropdownItems?: React.ReactNode[];
  loading?: boolean;
  size?: ButtonSize;
  triggerProps?: LoadingButtonProps & Record<`data-${string}`, string>;
} & Omit<MenuProps, "children" | "refEl" | "trigger">;

export const ButtonDropdown: React.FC<Props> = ({
  children,
  "data-testid": dataTestId = "ellipsis-btn",
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
    data-testid="card-dropdown"
    open={open}
    setOpen={setOpen}
    {...menuProps}
    trigger={
      <LoadingButton
        data-testid={dataTestId}
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
