import { vi } from "vitest";
import {
  renderWithRouterMatch as render,
  screen,
} from "@evg-ui/lib/test_utils";
import { ProjectType } from "./tabs/utils";

describe("SharedSettings / Pull Requests tab feature flag", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("hides the Pull Requests nav item when new project navigation is disabled", async () => {
    vi.doMock("constants/featureFlags", () => ({
      showNewProjectNavigation: false,
    }));
    const { default: SharedSettings } = await import("./index");
    render(
      <SharedSettings
        hasLoaded
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
    expect(
      screen.queryByDataCy("navitem-pull-requests"),
    ).not.toBeInTheDocument();
  });

  it("shows the Pull Requests nav item when new project navigation is enabled", async () => {
    vi.doMock("constants/featureFlags", () => ({
      showNewProjectNavigation: true,
    }));
    const { default: SharedSettings } = await import("./index");
    render(
      <SharedSettings
        hasLoaded
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
    expect(screen.getByDataCy("navitem-pull-requests")).toBeInTheDocument();
  });
});
