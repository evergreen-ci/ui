// TODO DEVPROD-31534: Remove this test file once the feature flag is removed
import { vi } from "vitest";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { ProjectType } from "./tabs/utils";

vi.mock("components/ProjectSelect", () => ({
  ProjectSelect: () => <div data-cy="mock-project-select" />,
}));
vi.mock("components/Banners", () => ({
  ProjectBanner: () => <div data-cy="mock-project-banner" />,
}));
vi.mock("./CreateDuplicateProjectButton", () => ({
  CreateDuplicateProjectButton: () => (
    <div data-cy="mock-create-duplicate-project-button" />
  ),
}));

const navItems = [
  // Evergreen group – rendered expanded by default
  { tabLabel: "Merge Queue", dataCy: "navitem-merge-queue", groupHeader: null },
  // GitHub group – collapsed by default
  {
    tabLabel: "Pull Requests",
    dataCy: "navitem-pull-requests",
    groupHeader: "GitHub",
  },
  {
    tabLabel: "Commit Checks",
    dataCy: "navitem-commit-checks",
    groupHeader: "GitHub",
  },
  {
    tabLabel: "Git Tags",
    dataCy: "navitem-git-tags",
    groupHeader: "GitHub",
  },
];

describe("Feature flag tests for DEVPROD-31534", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  navItems.forEach(({ dataCy, groupHeader, tabLabel }) => {
    describe(`${tabLabel} tab`, () => {
      it(`hides the ${tabLabel} nav item when new project navigation is disabled`, async () => {
        vi.doMock("constants/featureFlags", () => ({
          showNewProjectNavigation: false,
        }));
        const { default: SharedSettings } = await import("./index");

        render(
          <SharedSettings
            hasLoaded={false}
            owner="evergreen-ci"
            projectData={undefined}
            projectIdentifier="evergreen"
            projectType={ProjectType.Project}
            repo="spruce"
            repoData={undefined}
            repoId="spruce"
          />,
          {
            route: "/project/evergreen/settings/general",
            path: "/project/:projectIdentifier/settings/:tab",
          },
        );

        expect(screen.queryByDataCy(dataCy)).not.toBeInTheDocument();
      });

      it(`shows the ${tabLabel} nav item when new project navigation is enabled`, async () => {
        vi.doMock("constants/featureFlags", () => ({
          showNewProjectNavigation: true,
        }));
        const { default: SharedSettings } = await import("./index");

        render(
          <SharedSettings
            hasLoaded={false}
            owner="evergreen-ci"
            projectData={undefined}
            projectIdentifier="evergreen"
            projectType={ProjectType.Project}
            repo="spruce"
            repoData={undefined}
            repoId="spruce"
          />,
          {
            route: "/project/evergreen/settings/general",
            path: "/project/:projectIdentifier/settings/:tab",
          },
        );

        // Expand the GitHub group if this nav item lives there
        if (groupHeader) {
          await userEvent.click(screen.getByText(groupHeader));
        }

        expect(screen.getByDataCy(dataCy)).toBeInTheDocument();
      });
    });
  });
});
