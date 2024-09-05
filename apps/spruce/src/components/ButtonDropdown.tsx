import Icon from "@leafygreen-ui/icon";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { LoadingButton } from "components/Buttons";
import { zIndex } from "constants/tokens";

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
      >
        <Icon glyph="Ellipsis" />
      </LoadingButton>
    }
  >
    {dropdownItems}
  </Menu>
);

export const DropdownItem = MenuItem;
