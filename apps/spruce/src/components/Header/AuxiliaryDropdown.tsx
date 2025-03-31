import { useRef } from "react";
import { useNavbarAnalytics } from "analytics";
import EvergreenRedesignModal, {
  EvergreenRedesignModalHandle,
} from "components/AprilFoolsEvergreenRedesign";
import {
  routes,
  getDistroSettingsRoute,
  getProjectPatchesRoute,
  getProjectSettingsRoute,
  getTaskQueueRoute,
  getCommitsRoute,
} from "constants/routes";
import { useFirstDistro } from "hooks";
import { NavDropdown } from "./NavDropdown";

interface AuxiliaryDropdownProps {
  projectIdentifier: string;
}

export const AuxiliaryDropdown: React.FC<AuxiliaryDropdownProps> = ({
  projectIdentifier,
}) => {
  const { sendEvent } = useNavbarAnalytics();
  const { distro } = useFirstDistro();
  const prankRef = useRef<EvergreenRedesignModalHandle>(null);

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
      to: getDistroSettingsRoute(distro),
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
    {
      "data-cy": "auxiliary-dropdown-project-health",
      text: "Project Health",
      to: getCommitsRoute(projectIdentifier),
      onClick: () => sendEvent({ name: "Clicked project health link" }),
    },
    {
      text: "April Fools",
      onClick: () => prankRef.current?.openModal(),
    },
  ];

  return (
    <>
      <EvergreenRedesignModal ref={prankRef} />
      <NavDropdown
        dataCy="auxiliary-dropdown-link"
        menuItems={menuItems}
        title="More"
      />
    </>
  );
};
