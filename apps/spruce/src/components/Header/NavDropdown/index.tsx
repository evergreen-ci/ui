import { Fragment, useState } from "react";
import { Menu, MenuGroup, MenuItem, MenuSeparator } from "@leafygreen-ui/menu";
import { Link, To } from "react-router-dom";
import { Icon } from "@evg-ui/lib/components/Icon";
import styles from "./index.module.css";

const NavDropdownMenuIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <Icon glyph={open ? "CaretUp" : "CaretDown"} role="presentation" />
);

export interface MenuItemType {
  "data-testid"?: string;
  description?: string;
  text: string | React.ReactNode;
  href?: string;
  to?: To;
  onClick?: () => void;
}

export interface MenuGroupType {
  text: string;
  menuItems: MenuItemType[];
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
  ...rest
}) => {
  const isInternalLink = to !== undefined;

  return isInternalLink ? (
    <MenuItem
      {...rest}
      as={Link}
      data-testid={itemDataTestId}
      onClick={closeMenu}
      to={to}
    >
      {text}
    </MenuItem>
  ) : (
    <MenuItem
      {...rest}
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
  menuItems: (MenuItemType | MenuGroupType)[];
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
      darkMode // This prop shouldn't be required, but otherwise MenuGroup is white
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
        <Fragment key={`dropdown_${menuItem.text}`}>
          {"menuItems" in menuItem ? (
            <>
              <MenuSeparator />
              <MenuGroup>
                {menuItem.menuItems.map((m) => (
                  <NavDropdownItem
                    key={`dropdown_${m.text}`}
                    closeMenu={() => {
                      m.onClick?.(); // call if exists
                      setOpenMenu(false);
                    }}
                    {...m}
                  />
                ))}
              </MenuGroup>
            </>
          ) : (
            <NavDropdownItem
              closeMenu={() => {
                menuItem.onClick?.(); // call if exists
                setOpenMenu(false);
              }}
              {...menuItem}
            />
          )}
        </Fragment>
      ))}
    </Menu>
  );
};
