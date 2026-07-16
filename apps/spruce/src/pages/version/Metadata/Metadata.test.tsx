import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  userEvent,
  within,
} from "@evg-ui/lib/test_utils";
import { VersionQuery } from "gql/generated/types";
import { getUserMock } from "gql/mocks/getUser";
import { PatchStatus } from "types/patch";
import { Metadata } from ".";

type Version = NonNullable<VersionQuery["version"]>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[getUserMock]}>{children}</MockedProvider>
);

const baseVersion: Version = {
  __typename: "Version",
  activated: true,
  baseVersion: null,
  cost: null,
  createTime: new Date("2024-01-01"),
  errors: [],
  externalLinksForMetadata: [],
  finishTime: null,
  gitTags: null,
  id: "version123",
  ignored: false,
  isPatch: false,
  manifest: null,
  message: "Test commit",
  order: 1,
  parameters: [],
  patch: null,
  previousVersion: {
    __typename: "Version",
    id: "prev123",
    revision: "prevrevision",
  },
  projectMetadata: {
    __typename: "Project",
    branch: "main",
    id: "evergreen",
    identifier: "evergreen",
    owner: "evergreen-ci",
    repo: "evergreen",
  },
  repo: "evergreen",
  requester: "gitter_request",
  revision: "abc123def456",
  startTime: new Date("2024-01-01"),
  status: PatchStatus.Started,
  taskCount: null,
  upstreamProject: null,
  user: {
    __typename: "UserLite",
    displayName: "Test User",
    userId: "testuser",
  },
  versionTiming: null,
  warnings: [],
};

describe("version metadata sections", () => {
  it("ShowsSectionsAndTimeline", () => {
    render(
      <Metadata
        version={{
          ...baseVersion,
          externalLinksForMetadata: [
            {
              __typename: "ExternalLinkForMetadata",
              displayName: "Evergreen Docs",
              url: "https://example.com/docs",
            },
          ],
          finishTime: new Date("2024-01-02"),
          parameters: [
            {
              __typename: "Parameter",
              key: "burn_in",
              value: "true",
            },
          ],
          versionTiming: {
            __typename: "VersionTiming",
            makespan: 3600000,
            timeTaken: 600000,
          },
        }}
      />,
      {
        path: "/version/:id",
        route: "/version/version123",
        wrapper,
      },
    );

    expect(screen.getByText("Project:")).toBeInTheDocument();
    expect(screen.getByText("Timeline")).toBeInTheDocument();
    expect(screen.getByText("Execution")).toBeInTheDocument();
    expect(screen.getByText("External Links")).toBeInTheDocument();
    expect(
      screen.getByDataCy("version-metadata-submitted-at"),
    ).toHaveTextContent("Submitted");
    expect(screen.getByDataCy("version-metadata-started")).toHaveTextContent(
      "Started",
    );
    expect(screen.getByDataCy("version-metadata-finished")).toHaveTextContent(
      "Finished",
    );
    expect(screen.getByText("Makespan:")).toBeInTheDocument();
    expect(screen.getByText("Time taken:")).toBeInTheDocument();
    expect(screen.getByDataCy("parameters-link")).toBeInTheDocument();
    expect(screen.getByDataCy("external-link")).toHaveTextContent(
      "Evergreen Docs",
    );
  });
});

describe("version metadata cost display", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  it("hides cost row when cost is null", () => {
    render(<Metadata version={baseVersion} />, {
      path: "/version/:id",
      route: "/version/version123",
      wrapper,
    });
    expect(screen.queryByText("Cost:")).not.toBeInTheDocument();
  });

  it("shows actual cost value when cost is set", () => {
    const version: Version = {
      ...baseVersion,
      cost: { __typename: "Cost", total: 321.45 },
    };
    render(<Metadata version={version} />, {
      path: "/version/:id",
      route: "/version/version123",
      wrapper,
    });
    expect(screen.getByText("$321.45")).toBeInTheDocument();
  });

  it("shows estimate tooltip when version is not complete", async () => {
    const user = userEvent.setup();
    render(
      <Metadata
        version={{
          ...baseVersion,
          cost: { __typename: "Cost", total: 10 },
          finishTime: null,
        }}
      />,
      {
        path: "/version/:id",
        route: "/version/version123",
        wrapper,
      },
    );
    const costWrapper = screen.getByText("Cost:").closest("span")!;
    await user.hover(within(costWrapper).getByTestId("info-sprinkle-icon"));
    await screen.findByText("Estimated cost of completed tasks so far.");
  });

  it("shows child patches tooltip when running with children", async () => {
    const user = userEvent.setup();
    render(
      <Metadata
        version={{
          ...baseVersion,
          finishTime: null,
          isPatch: true,
          patch: {
            __typename: "Patch",
            childPatches: [
              { __typename: "Patch", id: "child1" } as unknown as NonNullable<
                NonNullable<Version["patch"]>["childPatches"]
              >[number],
            ],
            cost: { __typename: "Cost", total: 50 },
            githubPatchData: null,
            includedLocalModules: null,
          } as unknown as Version["patch"],
        }}
      />,
      {
        path: "/version/:id",
        route: "/version/version123",
        wrapper,
      },
    );
    const costWrapper = screen.getByText("Cost:").closest("span")!;
    await user.hover(within(costWrapper).getByTestId("info-sprinkle-icon"));
    await screen.findByText(
      "Estimated cost of completed tasks so far, including child patches.",
    );
  });

  it("shows child patches tooltip when complete with children", async () => {
    const user = userEvent.setup();
    render(
      <Metadata
        version={{
          ...baseVersion,
          finishTime: new Date("2024-01-02"),
          isPatch: true,
          patch: {
            __typename: "Patch",
            childPatches: [
              { __typename: "Patch", id: "child1" } as unknown as NonNullable<
                NonNullable<Version["patch"]>["childPatches"]
              >[number],
            ],
            cost: { __typename: "Cost", total: 50 },
            githubPatchData: null,
            includedLocalModules: null,
          } as unknown as Version["patch"],
        }}
      />,
      {
        path: "/version/:id",
        route: "/version/version123",
        wrapper,
      },
    );
    const costWrapper = screen.getByText("Cost:").closest("span")!;
    await user.hover(within(costWrapper).getByTestId("info-sprinkle-icon"));
    await screen.findByText(
      "Total cost of all tasks, including child patches.",
    );
  });

  it("shows complete tooltip when version is complete", async () => {
    const user = userEvent.setup();
    render(
      <Metadata
        version={{
          ...baseVersion,
          cost: { __typename: "Cost", total: 100 },
          finishTime: new Date("2024-01-02"),
        }}
      />,
      {
        path: "/version/:id",
        route: "/version/version123",
        wrapper,
      },
    );
    const costWrapper = screen.getByText("Cost:").closest("span")!;
    await user.hover(within(costWrapper).getByTestId("info-sprinkle-icon"));
    await screen.findByText("Total cost of all tasks.");
  });

  it("hides cost detail button when version is running", () => {
    render(
      <Metadata
        version={{
          ...baseVersion,
          cost: { __typename: "Cost", total: 100 },
          finishTime: null,
        }}
      />,
      {
        path: "/version/:id",
        route: "/version/version123",
        wrapper,
      },
    );
    expect(screen.queryByDataCy("cost-details-button")).not.toBeInTheDocument();
  });

  it("shows cost detail button when version is complete", () => {
    render(
      <Metadata
        version={{
          ...baseVersion,
          cost: { __typename: "Cost", total: 100 },
          finishTime: new Date("2024-01-02"),
        }}
      />,
      {
        path: "/version/:id",
        route: "/version/version123",
        wrapper,
      },
    );
    expect(screen.getByDataCy("cost-details-button")).toBeInTheDocument();
  });

  it("shows patch cost total in modal for patches", async () => {
    const user = userEvent.setup();
    render(
      <Metadata
        version={{
          ...baseVersion,
          cost: { __typename: "Cost", total: 1.5 },
          finishTime: new Date("2024-01-02"),
          isPatch: true,
          patch: {
            __typename: "Patch",
            childPatches: null,
            cost: { __typename: "Cost", total: 3.75 },
            githubPatchData: null,
            id: "child-patch",
            includedLocalModules: [],
            patchNumber: 123,
          },
        }}
      />,
      {
        path: "/version/:id",
        route: "/version/version123",
        wrapper,
      },
    );
    await user.click(screen.getByDataCy("cost-details-button"));
    // Total row in the modal uses patch.cost.total (3.75), not cost.total (1.5).
    const modal = screen.getByDataCy("cost-modal");
    expect(within(modal).getByText("$3.75")).toBeInTheDocument();
  });

  it("can reopen cost modal after closing", async () => {
    const user = userEvent.setup();
    render(
      <Metadata
        version={{
          ...baseVersion,
          cost: { __typename: "Cost", total: 100 },
          finishTime: new Date("2024-01-02"),
        }}
      />,
      {
        path: "/version/:id",
        route: "/version/version123",
        wrapper,
      },
    );
    await user.click(screen.getByDataCy("cost-details-button"));
    expect(screen.getByDataCy("cost-modal")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close modal" }));
    expect(screen.queryByDataCy("cost-modal")).not.toBeInTheDocument();
    await user.click(screen.getByDataCy("cost-details-button"));
    expect(screen.getByDataCy("cost-modal")).toBeInTheDocument();
  });
});
