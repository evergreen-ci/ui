import { stringifyQuery } from "@evg-ui/lib/src/utils/query-string";
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
      onClick: () => sendEvent({ name: "Clicked all hosts link" }),
      text: "All Hosts",
      to: routes.hosts,
    },
    {
      onClick: () => sendEvent({ name: "Clicked task queue link" }),
      text: "Task Queue",
      to: getTaskQueueRoute(""),
    },
    {
      "data-cy": "auxiliary-dropdown-distro-settings",
      onClick: () => sendEvent({ name: "Clicked distro settings link" }),
      text: "Distro Settings",
      to: redirectRoutes.distroSettings,
    },
    {
      "data-cy": "auxiliary-dropdown-project-patches",
      onClick: () => sendEvent({ name: "Clicked project patches link" }),
      text: "Project Patches",
      to: getProjectPatchesRoute(projectIdentifier),
    },
    {
      "data-cy": "auxiliary-dropdown-merge-queue",
      onClick: () => sendEvent({ name: "Clicked merge queue link" }),
      text: "Merge Queue",
      to: {
        pathname: getProjectPatchesRoute(projectIdentifier),
        search: stringifyQuery({ mergeQueue: true }),
      },
    },
    {
      "data-cy": "auxiliary-dropdown-project-settings",
      onClick: () => sendEvent({ name: "Clicked project settings link" }),
      text: "Project Settings",
      to: getProjectSettingsRoute(projectIdentifier),
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
