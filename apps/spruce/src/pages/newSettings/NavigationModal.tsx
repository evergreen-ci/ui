import React from "react";
import { matchPath } from "react-router-dom";
import { NavigationWarningModal } from "components/Settings";
import { routes } from "constants/routes";
import { useHasUnsavedTab } from "./Context";
import { getTabTitle } from "./getTabTitle";

export const NavigationModal: React.FC = () => {
  const { hasUnsaved, unsavedTabs } = useHasUnsavedTab();

  const shouldConfirmNavigation = ({
    nextLocation,
  }: {
    nextLocation: any;
  }): boolean => {
    const isNewSettingsRoute =
      nextLocation && !!matchPath(nextLocation.pathname, routes.newSettings);
    if (!isNewSettingsRoute) {
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
