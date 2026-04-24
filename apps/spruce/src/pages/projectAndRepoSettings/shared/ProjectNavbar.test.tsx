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

describe("SharedSettings / Git Tags tab feature flag", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("hides the Git Tags nav item when new project navigation is disabled", async () => {
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
    expect(screen.queryByDataCy("navitem-git-tags")).not.toBeInTheDocument();
  });

  it("shows the Git Tags nav item when new project navigation is enabled", async () => {
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
    expect(screen.getByDataCy("navitem-git-tags")).toBeInTheDocument();
  });
});
