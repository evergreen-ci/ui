import {
  Button,
  Menu,
  MenuItem,
  MenuPopover,
  MenuRoot,
} from "@via-ds/components";
import Ellipsis from "@via-ds/icons/Ellipsis";

type Props = {
  children?: React.ReactNode;
  disabled?: boolean;
  "data-testid"?: string;
  dropdownItems?: React.ReactNode[];
  loading?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  triggerRef?: React.Ref<HTMLButtonElement>;
};

export const ButtonDropdown: React.FC<Props> = ({
  children,
  "data-testid": dataTestId = "ellipsis-btn",
  disabled = false,
  dropdownItems,
  loading = false,
  open,
  setOpen,
  triggerRef,
}) => (
  <MenuRoot isOpen={open} onOpenChange={setOpen}>
    <Button
      ref={triggerRef}
      aria-label="More actions"
      data-testid={dataTestId}
      isDisabled={disabled}
      isPending={loading}
    >
      <Ellipsis />
    </Button>
    <MenuPopover>
      <Menu data-testid="card-dropdown">{dropdownItems ?? children}</Menu>
    </MenuPopover>
  </MenuRoot>
);

export const DropdownItem = MenuItem;
