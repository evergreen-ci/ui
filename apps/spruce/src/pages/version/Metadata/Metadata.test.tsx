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
  id: "version123",
  activated: true,
  createTime: new Date("2024-01-01"),
  errors: [],
  finishTime: null,
  ignored: false,
  isPatch: false,
  message: "Test commit",
  order: 1,
  repo: "evergreen",
  requester: "gitter_request",
  revision: "abc123def456",
  startTime: new Date("2024-01-01"),
  status: PatchStatus.Started,
  taskCount: null,
  warnings: [],
  baseVersion: null,
  cost: null,
  externalLinksForMetadata: [],
  gitTags: null,
  manifest: null,
  parameters: [],
  patch: null,
  previousVersion: {
    __typename: "Version",
    id: "prev123",
    revision: "prevrevision",
  },
  projectMetadata: {
    __typename: "Project",
    id: "evergreen",
    branch: "main",
    identifier: "evergreen",
    owner: "evergreen-ci",
    repo: "evergreen",
  },
  upstreamProject: null,
  user: {
    __typename: "UserLite",
    displayName: "Test User",
    userId: "testuser",
  },
  versionTiming: null,
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
        route: "/version/version123",
        path: "/version/:id",
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

  it("HidesCostRowWhenCostIsNull", () => {
    render(<Metadata version={baseVersion} />, {
      route: "/version/version123",
      path: "/version/:id",
      wrapper,
    });
    expect(screen.queryByText("Cost:")).not.toBeInTheDocument();
  });

  it("ShowsActualCostValueWhenCostIsSet", () => {
    const version: Version = {
      ...baseVersion,
      cost: { __typename: "Cost", total: 321.45 },
    };
    render(<Metadata version={version} />, {
      route: "/version/version123",
      path: "/version/:id",
      wrapper,
    });
    expect(screen.getByText("$321.45")).toBeInTheDocument();
  });

  it("ShowsEstimateTooltipWhenVersionIsNotComplete", async () => {
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
        route: "/version/version123",
        path: "/version/:id",
        wrapper,
      },
    );
    const costWrapper = screen.getByText("Cost:").closest("span")!;
    await user.hover(within(costWrapper).getByTestId("info-sprinkle-icon"));
    await screen.findByText("Estimated cost of completed tasks so far.");
  });

  it("ShowsChildPatchesTooltipWhenRunningWithChildren", async () => {
    const user = userEvent.setup();
    render(
      <Metadata
        version={{
          ...baseVersion,
          isPatch: true,
          patch: {
            __typename: "Patch",
            cost: { __typename: "Cost", total: 50 },
            childPatches: [
              { __typename: "Patch", id: "child1" } as unknown as NonNullable<
                NonNullable<Version["patch"]>["childPatches"]
              >[number],
            ],
            githubPatchData: null,
            includedLocalModules: null,
          } as unknown as Version["patch"],
          finishTime: null,
        }}
      />,
      {
        route: "/version/version123",
        path: "/version/:id",
        wrapper,
      },
    );
    const costWrapper = screen.getByText("Cost:").closest("span")!;
    await user.hover(within(costWrapper).getByTestId("info-sprinkle-icon"));
    await screen.findByText(
      "Estimated cost of completed tasks so far, including child patches.",
    );
  });

  it("ShowsChildPatchesTooltipWhenCompleteWithChildren", async () => {
    const user = userEvent.setup();
    render(
      <Metadata
        version={{
          ...baseVersion,
          isPatch: true,
          patch: {
            __typename: "Patch",
            cost: { __typename: "Cost", total: 50 },
            childPatches: [
              { __typename: "Patch", id: "child1" } as unknown as NonNullable<
                NonNullable<Version["patch"]>["childPatches"]
              >[number],
            ],
            githubPatchData: null,
            includedLocalModules: null,
          } as unknown as Version["patch"],
          finishTime: new Date("2024-01-02"),
        }}
      />,
      {
        route: "/version/version123",
        path: "/version/:id",
        wrapper,
      },
    );
    const costWrapper = screen.getByText("Cost:").closest("span")!;
    await user.hover(within(costWrapper).getByTestId("info-sprinkle-icon"));
    await screen.findByText(
      "Total cost of all tasks, including child patches.",
    );
  });

  it("ShowsCompleteTooltipWhenVersionIsComplete", async () => {
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
        route: "/version/version123",
        path: "/version/:id",
        wrapper,
      },
    );
    const costWrapper = screen.getByText("Cost:").closest("span")!;
    await user.hover(within(costWrapper).getByTestId("info-sprinkle-icon"));
    await screen.findByText("Total cost of all tasks.");
  });

  it("HidesCostDetailsButtonWhenVersionIsRunning", () => {
    render(
      <Metadata
        version={{
          ...baseVersion,
          cost: { __typename: "Cost", total: 100 },
          finishTime: null,
        }}
      />,
      {
        route: "/version/version123",
        path: "/version/:id",
        wrapper,
      },
    );
    expect(screen.queryByDataCy("cost-details-button")).not.toBeInTheDocument();
  });

  it("ShowsCostDetailsButtonWhenVersionIsComplete", () => {
    render(
      <Metadata
        version={{
          ...baseVersion,
          cost: { __typename: "Cost", total: 100 },
          finishTime: new Date("2024-01-02"),
        }}
      />,
      {
        route: "/version/version123",
        path: "/version/:id",
        wrapper,
      },
    );
    expect(screen.getByDataCy("cost-details-button")).toBeInTheDocument();
  });

  it("ShowsPatchCostTotalInModalForPatches", async () => {
    const user = userEvent.setup();
    render(
      <Metadata
        version={{
          ...baseVersion,
          isPatch: true,
          cost: { __typename: "Cost", total: 1.5 },
          patch: {
            __typename: "Patch",
            cost: { __typename: "Cost", total: 3.75 },
            childPatches: null,
            githubPatchData: null,
            includedLocalModules: [],
            id: "child-patch",
            patchNumber: 123,
          },
          finishTime: new Date("2024-01-02"),
        }}
      />,
      {
        route: "/version/version123",
        path: "/version/:id",
        wrapper,
      },
    );
    await user.click(screen.getByDataCy("cost-details-button"));
    // Total row in the modal uses patch.cost.total (3.75), not cost.total (1.5).
    const modal = screen.getByDataCy("cost-modal");
    expect(within(modal).getByText("$3.75")).toBeInTheDocument();
  });

  it("CanReopenCostModalAfterClosing", async () => {
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
        route: "/version/version123",
        path: "/version/:id",
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
