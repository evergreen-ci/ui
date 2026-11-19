import { Badge } from "@via-ds/components";
import { stringifyQuery } from "@evg-ui/lib/src/utils/query-string";
import { useNavbarAnalytics } from "analytics";
import {
  getProjectCommitsRoute,
  getProjectPatchesRoute,
  getProjectSettingsRoute,
  getTaskQueueRoute,
  redirectRoutes,
  routes,
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
      text: "Distro Task Queue",
      to: getTaskQueueRoute(""),
      onClick: () => sendEvent({ name: "Clicked task queue link" }),
    },
    {
      "data-testid": "auxiliary-dropdown-distro-settings",
      to: redirectRoutes.distroSettings,
      text: "Distro Settings",
      onClick: () => sendEvent({ name: "Clicked distro settings link" }),
    },
    {
      text: "Project Pages",
      menuItems: [
        {
          "data-testid": "auxiliary-dropdown-project-patches",
          to: getProjectPatchesRoute(projectIdentifier),
          text: "Project Patches",
          onClick: () => sendEvent({ name: "Clicked project patches link" }),
        },
        {
          "data-testid": "auxiliary-dropdown-merge-queue",
          to: {
            pathname: getProjectPatchesRoute(projectIdentifier),
            search: stringifyQuery({ mergeQueue: true }),
          },
          text: "Merge Queue",
          onClick: () => sendEvent({ name: "Clicked merge queue link" }),
        },
        {
          "data-testid": "auxiliary-dropdown-project-settings",
          text: (
            <span style={{ display: "flex", justifyContent: "space-between" }}>
              Commit History<Badge>New</Badge>
            </span>
          ),
          description:
            "Streamlined page showing a project's most recent commits and success rate.",
          to: getProjectCommitsRoute(projectIdentifier),
          onClick: () => sendEvent({ name: "Clicked project commits link" }),
        },

        {
          "data-testid": "auxiliary-dropdown-project-settings",
          text: "Project Settings",
          to: getProjectSettingsRoute(projectIdentifier),
          onClick: () => sendEvent({ name: "Clicked project settings link" }),
        },
      ],
    },
  ];

  return (
    <NavDropdown
      dataTestId="auxiliary-dropdown-link"
      menuItems={menuItems}
      title="More"
    />
  );
};
