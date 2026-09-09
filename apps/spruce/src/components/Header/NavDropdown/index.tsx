import { useState } from "react";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { Link, To } from "react-router-dom";
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

interface NavDropdownItemType extends MenuItemType {
  closeMenu: () => void;
}

const NavDropdownItem: React.FC<NavDropdownItemType> = ({
  closeMenu,
  "data-testid": itemDataTestId,
  href,
  text,
  to,
}) => {
  const isInternalLink = to !== undefined;

  return isInternalLink ? (
    <MenuItem
      as={Link}
      data-testid={itemDataTestId}
      onClick={closeMenu}
      to={to}
    >
      {text}
    </MenuItem>
  ) : (
    <MenuItem
      as="a"
      data-testid={itemDataTestId}
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      href={href}
      onClick={closeMenu}
    >
      {text}
    </MenuItem>
  );
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
    <Menu
      justify="start"
      open={openMenu}
      setOpen={setOpenMenu}
      trigger={
        <span className={styles.navDropdownTitle} data-testid={dataTestId}>
          {title}
          <NavDropdownMenuIcon open={openMenu} />
        </span>
      }
    >
      {menuItems.map((menuItem) => (
        <NavDropdownItem
          key={`dropdown_${menuItem.text}`}
          closeMenu={() => {
            menuItem.onClick?.(); // call if exists
            setOpenMenu(false);
          }}
          {...menuItem}
        />
      ))}
    </Menu>
  );
};
