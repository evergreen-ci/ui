import { useEffect, useState } from "react";
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

export const usePopconfirmAnchor = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", closeOnEscape, true);
    return () => document.removeEventListener("keydown", closeOnEscape, true);
  }, [isOpen, onClose]);

  const getItemProps = (
    id: string,
    onAction: () => void,
    isPopconfirmOpen: boolean,
  ) => ({
    className: isPopconfirmOpen ? styles.openItem : undefined,
    id,
    onAction: () => {
      setAnchorEl(
        document.querySelector<HTMLElement>(
          `[role="menuitem"][data-key="${id}"]`,
        ),
      );
      onAction();
    },
    shouldCloseOnSelect: false,
  });

  return { anchorRef: { current: anchorEl }, getItemProps };
};
