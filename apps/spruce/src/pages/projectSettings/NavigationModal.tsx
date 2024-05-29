import { matchPath, useParams } from "react-router-dom";
import { NavigationWarningModal } from "components/Settings";
import { getProjectSettingsRoute, routes } from "constants/routes";
import { useHasUnsavedTab } from "./Context";
import { getTabTitle } from "./getTabTitle";

export const NavigationModal: React.FC = () => {
  const { hasUnsaved, unsavedTabs } = useHasUnsavedTab();
  const { projectIdentifier } = useParams();

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const shouldConfirmNavigation = ({ nextLocation }): boolean => {
    const isProjectSettingsRoute =
      nextLocation &&
      !!matchPath(`${routes.projectSettings}/*`, nextLocation.pathname);
    if (!isProjectSettingsRoute) {
      return hasUnsaved;
    }

    /* Identify if the user is navigating to a new project's settings via project select dropdown */
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const currentProjectRoute = getProjectSettingsRoute(projectIdentifier);
    const isNewProjectSettingsRoute = !matchPath(
      `${currentProjectRoute}/*`,
      nextLocation.pathname,
    );
    if (isNewProjectSettingsRoute) {
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
