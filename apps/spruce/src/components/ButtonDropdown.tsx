import { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  MenuPopover,
  MenuRoot,
} from "@via-ds/components";
import Ellipsis from "@via-ds/icons/Ellipsis";
import styles from "./ButtonDropdown.module.css";

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

export const usePopconfirmAnchor = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const getItemProps = (onAction: () => void, isPopconfirmOpen: boolean) => ({
    className: isPopconfirmOpen ? styles.openItem : undefined,
    onAction,
    onPress: (e: { target: Element }) =>
      setAnchorEl(e.target.closest<HTMLElement>('[role="menuitem"]')),
    shouldCloseOnSelect: false,
  });

  return { anchorRef: { current: anchorEl }, getItemProps };
};
