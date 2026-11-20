import { useState } from "react";
import { Button, ButtonVariant } from "@via-ds/components/button";
import { Menu, MenuItem, MenuPopover, MenuRoot } from "@via-ds/components/menu";
import { To, createPath } from "react-router-dom";
import { Icon } from "@evg-ui/lib/components/Icon";
import styles from "./index.module.css";

const NavDropdownMenuIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <Icon glyph={open ? "CaretUp" : "CaretDown"} role="presentation" />
);

export interface MenuItemType {
  "data-testid"?: string;
  text: string | React.ReactNode;
  href?: string;
  to?: To;
  onClick?: () => void;
}

const getItemHref = ({ href, to }: MenuItemType) => {
  if (to === undefined) {
    return href;
  }
  return typeof to === "string" ? to : createPath(to);
};

interface NavDropdownProps {
  dataTestId?: string;
  menuItems: MenuItemType[];
  title: string;
}

export const NavDropdown: React.FC<NavDropdownProps> = ({
  dataTestId,
  menuItems,
  title,
}) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <MenuRoot isOpen={openMenu} onOpenChange={setOpenMenu}>
      <Button
        className={styles.navDropdownTitle}
        data-testid={dataTestId}
        variant={ButtonVariant.Tertiary}
      >
        {title}
        <NavDropdownMenuIcon open={openMenu} />
      </Button>
      <MenuPopover>
        <Menu aria-label={title}>
          {menuItems.map((menuItem) => (
            <MenuItem
              key={`dropdown_${menuItem.text}`}
              data-testid={menuItem["data-testid"]}
              href={getItemHref(menuItem)}
              id={`dropdown_${menuItem.text}`}
              onAction={menuItem.onClick}
              textValue={
                typeof menuItem.text === "string" ? menuItem.text : undefined
              }
            >
              {menuItem.text}
            </MenuItem>
          ))}
        </Menu>
      </MenuPopover>
    </MenuRoot>
  );
};
