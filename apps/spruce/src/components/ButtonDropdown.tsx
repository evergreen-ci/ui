import { MenuRoot, MenuPopover, Menu, MenuItem, MenuProps } from "@via-ds/components/menu";
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
  open?: boolean;
  setOpen?: (open: boolean) => void;
  size?: "xsmall" | "small" | "default" | "large";
  triggerProps?: LoadingButtonProps & Record<`data-${string}`, string>;
} & Omit<MenuProps<object>, "children" | "refEl" | "trigger">;

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
  <MenuRoot isOpen={open} onOpenChange={setOpen}>
    <LoadingButton
      data-testid={dataTestId}
      disabled={disabled}
      loading={loading}
      size={size}
      {...triggerProps}
    >
      <Icon glyph="Ellipsis" />
    </LoadingButton>
    <MenuPopover>
      <Menu data-testid="card-dropdown" {...menuProps}>
        {dropdownItems ?? children}
      </Menu>
    </MenuPopover>
  </MenuRoot>
);

export const DropdownItem = MenuItem;
