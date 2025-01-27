import Icon from "@leafygreen-ui/icon";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { LoadingButton } from "components/Buttons";

interface Props {
  disabled?: boolean;
  loading?: boolean;
  dropdownItems: JSX.Element[];
  size?: "default" | "small" | "large";
  "data-cy"?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export const ButtonDropdown: React.FC<Props> = ({
  "data-cy": dataCy = "ellipsis-btn",
  disabled = false,
  dropdownItems,
  loading = false,
  open = undefined,
  setOpen = undefined,
  size = "small",
  ...rest
}) => (
  <Menu
    adjustOnMutation
    data-cy="card-dropdown"
    open={open}
    popoverZIndex={zIndex.popover}
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    setOpen={setOpen}
    trigger={
      <LoadingButton
        data-cy={dataCy}
        disabled={disabled}
        loading={loading}
        size={size}
        {...rest}
      >
        <Icon glyph="Ellipsis" />
      </LoadingButton>
    }
  >
    {dropdownItems}
  </Menu>
);

export const DropdownItem = MenuItem;
