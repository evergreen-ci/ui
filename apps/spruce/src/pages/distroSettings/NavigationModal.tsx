import { matchPath, useParams } from "react-router-dom";
import { NavigationWarningModal } from "components/Settings";
import { getDistroSettingsRoute, routes } from "constants/routes";
import { useHasUnsavedTab } from "./Context";
import { getTabTitle } from "./getTabTitle";

export const NavigationModal: React.FC = () => {
  const { hasUnsaved, unsavedTabs } = useHasUnsavedTab();
  const { distroId } = useParams();

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const shouldConfirmNavigation = ({ nextLocation }): boolean => {
    const isDistroSettingsRoute =
      nextLocation &&
      !!matchPath(`${routes.distroSettings}/*`, nextLocation.pathname);
    if (!isDistroSettingsRoute) {
      return hasUnsaved;
    }

    /* Identify if the user is navigating to a new distro's settings via distro select dropdown */
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const currentDistroRoute = getDistroSettingsRoute(distroId);
    const isNewDistroSettingsRoute = !matchPath(
      `${currentDistroRoute}/*`,
      nextLocation.pathname,
    );
    if (isNewDistroSettingsRoute) {
      return hasUnsaved;
    }

    return false;
  };

  return (
    <NavigationWarningModal
      shouldBlock={shouldConfirmNavigation}
      unsavedTabs={unsavedTabs.map((tab) => ({
        title: getTabTitle(tab).title,
        value: tab,
      }))}
    />
  );
};
