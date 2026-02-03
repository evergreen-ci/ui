import { useNavbarAnalytics } from "analytics";
import {
  routes,
  redirectRoutes,
  getProjectPatchesRoute,
  getProjectSettingsRoute,
  getTaskQueueRoute,
} from "constants/routes";
import { NavDropdown } from "./NavDropdown";

interface AuxiliaryDropdownProps {
  projectIdentifier: string;
}

export const AuxiliaryDropdown: React.FC<AuxiliaryDropdownProps> = ({
  projectIdentifier,
}) => {
  const { sendEvent } = useNavbarAnalytics();

  const menuItems = [
    {
      text: "All Hosts",
      to: routes.hosts,
      onClick: () => sendEvent({ name: "Clicked all hosts link" }),
    },
    {
      text: "Task Queue",
      to: getTaskQueueRoute(""),
      onClick: () => sendEvent({ name: "Clicked task queue link" }),
    },
    {
      "data-cy": "auxiliary-dropdown-distro-settings",
      to: redirectRoutes.distroSettings,
      text: "Distro Settings",
      onClick: () => sendEvent({ name: "Clicked distro settings link" }),
    },
    {
      "data-cy": "auxiliary-dropdown-project-patches",
      to: getProjectPatchesRoute(projectIdentifier),
      text: "Project Patches",
      onClick: () => sendEvent({ name: "Clicked project patches link" }),
    },
    {
      "data-cy": "auxiliary-dropdown-project-settings",
      text: "Project Settings",
      to: getProjectSettingsRoute(projectIdentifier),
      onClick: () => sendEvent({ name: "Clicked project settings link" }),
    },
  ];

  return (
    <NavDropdown
      dataCy="auxiliary-dropdown-link"
      menuItems={menuItems}
      title="More"
    />
  );
};
