import Badge, { Variant as BadgeVariant } from "@leafygreen-ui/badge";
import { useNavbarAnalytics } from "analytics";
import {
  routes,
  getDistroSettingsRoute,
  getProjectPatchesRoute,
  getProjectSettingsRoute,
  getTaskQueueRoute,
  getCommitsRoute,
  getWaterfallRoute,
} from "constants/routes";
import {
  useAdminBetaFeatures,
  useFirstDistro,
  useMergedBetaFeatures,
} from "hooks";
import { NavDropdown } from "./NavDropdown";

interface AuxiliaryDropdownProps {
  projectIdentifier: string;
}

export const AuxiliaryDropdown: React.FC<AuxiliaryDropdownProps> = ({
  projectIdentifier,
}) => {
  const { sendEvent } = useNavbarAnalytics();
  const { distro } = useFirstDistro();

  const { adminBetaSettings } = useAdminBetaFeatures();

  const { betaFeatures } = useMergedBetaFeatures();
  const { spruceWaterfallEnabled } = betaFeatures ?? {};

  const inverseLink = spruceWaterfallEnabled
    ? {
        "data-cy": "auxiliary-dropdown-project-health",
        text: "Project Health",
        to: getCommitsRoute(projectIdentifier),
        onClick: () => sendEvent({ name: "Clicked project health link" }),
      }
    : {
        "data-cy": "auxiliary-dropdown-waterfall",
        text: (
          <span>
            Waterfall{" "}
            <Badge darkMode variant={BadgeVariant.Blue}>
              Beta
            </Badge>
          </span>
        ),
        to: getWaterfallRoute(projectIdentifier),
        onClick: () => sendEvent({ name: "Clicked waterfall link" }),
      };

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
    // Don't show inverse link if waterfall beta test is not active.
    ...(adminBetaSettings?.spruceWaterfallEnabled ? [inverseLink] : []),
  ];

  return (
    <NavDropdown
      dataCy="auxiliary-dropdown-link"
      menuItems={menuItems}
      title="More"
    />
  );
};
