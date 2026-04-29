// TODO DEVPROD-31534: Delete this file when the feature flag is removed
import { vi } from "vitest";
import {
  renderWithRouterMatch as render,
  screen,
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
  { tabLabel: "Pull Requests", dataCy: "navitem-pull-requests" },
  { tabLabel: "Commit Checks", dataCy: "navitem-commit-checks" },
];

describe("Feature flag tests for DEVPROD-31534", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  navItems.forEach(({ dataCy, tabLabel }) => {
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
        expect(screen.getByDataCy(dataCy)).toBeInTheDocument();
      });
    });
  });
});
