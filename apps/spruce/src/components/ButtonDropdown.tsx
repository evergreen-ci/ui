import { Size as ButtonSize } from "@leafygreen-ui/button";
import { Icon } from "@leafygreen-ui/icon";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { LoadingButton } from "components/Buttons";

interface Props {
  disabled?: boolean;
  loading?: boolean;
  dropdownItems: JSX.Element[];
  size?: ButtonSize;
  "data-cy"?: string;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
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
