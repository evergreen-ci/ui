import { useQuery } from "@apollo/client/react";
import { useAuthProviderContext } from "@evg-ui/lib/context";
import { useNavbarAnalytics } from "analytics";
import {
  PreferencesTabRoutes,
  getAdminSettingsRoute,
  getPreferencesRoute,
} from "constants/routes";
import { UserQuery } from "gql/generated/types";
import { USER } from "gql/queries";
import { MenuItemType, NavDropdown } from "./NavDropdown";

export const UserDropdown = () => {
  const { data } = useQuery<UserQuery>(USER);
  const { user } = data || {};
  const { displayName, permissions } = user || {};

  const { logoutAndRedirect } = useAuthProviderContext();
  const { sendEvent } = useNavbarAnalytics();

  const menuItems: MenuItemType[] = [
    {
      text: "Profile",
      to: getPreferencesRoute(PreferencesTabRoutes.Profile),
      onClick: () => sendEvent({ name: "Clicked profile link" }),
    },
    {
      text: "Notifications",
      to: getPreferencesRoute(PreferencesTabRoutes.Notifications),
      onClick: () => sendEvent({ name: "Clicked notifications link" }),
    },
    {
      text: "UI Settings",
      to: getPreferencesRoute(PreferencesTabRoutes.UISettings),
      onClick: () => sendEvent({ name: "Clicked UI settings link" }),
    },
    {
      "data-cy": "log-out",
      text: "Log out",
      onClick: () => logoutAndRedirect(),
    },
  ];
  if (permissions?.canEditAdminSettings) {
    menuItems.splice(-1, 0, {
      "data-cy": "admin-link",
      text: "Admin",
      href: getAdminSettingsRoute(),
      onClick: () => sendEvent({ name: "Clicked admin settings link" }),
    });
  }
  return (
    <NavDropdown
      dataCy="user-dropdown-link"
      menuItems={menuItems}
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      title={displayName}
    />
  );
};
