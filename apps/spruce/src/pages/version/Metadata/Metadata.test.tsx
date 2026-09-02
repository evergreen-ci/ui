import { ToastContext } from "@evg-ui/lib/context/toast";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { VersionQuery } from "gql/generated/types";
import { getUserMock } from "gql/mocks/getUser";
import { PatchStatus } from "types/patch";
import { Metadata } from ".";

type Version = NonNullable<VersionQuery["version"]>;

const toastContextValue = {
  error: vi.fn(),
  info: vi.fn(),
  progress: vi.fn(),
  success: vi.fn(),
  warning: vi.fn(),
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastContext.Provider value={toastContextValue}>
    <MockedProvider mocks={[getUserMock]}>{children}</MockedProvider>
  </ToastContext.Provider>
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
  quarantinedTestsSkippedCount: 0,
  upstreamProject: null,
  user: {
    __typename: "User",
    displayName: "Test User",
    userId: "testuser",
  },
  versionTiming: null,
};

describe("version metadata sections", () => {
  it("hides Execution when TSS is enabled but no tests were skipped", () => {
    render(
      <Metadata
        version={{
          ...baseVersion,
          projectMetadata: {
            ...baseVersion.projectMetadata!,
            testSelection: {
              __typename: "TestSelectionSettings",
              allowed: true,
            },
          },
        }}
      />,
      {
        route: "/version/version123",
        path: "/version/:id",
        wrapper,
      },
    );

    expect(screen.queryByText("Execution")).not.toBeInTheDocument();
  });

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
      screen.getByTestId("version-metadata-submitted-at"),
    ).toHaveTextContent("Submitted");
    expect(screen.getByTestId("version-metadata-started")).toHaveTextContent(
      "Started",
    );
    expect(screen.getByTestId("version-metadata-finished")).toHaveTextContent(
      "Finished",
    );
    expect(screen.getByText("Makespan:")).toBeInTheDocument();
    expect(screen.getByText("Time taken:")).toBeInTheDocument();
    expect(screen.getByTestId("parameters-link")).toBeInTheDocument();
    expect(screen.getByTestId("external-link")).toHaveTextContent(
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
      route: "/version/version123",
      path: "/version/:id",
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
      route: "/version/version123",
      path: "/version/:id",
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
        route: "/version/version123",
        path: "/version/:id",
        wrapper,
      },
    );
    const infoSprinkle = screen.getByRole("button", { name: "More info" });
    await user.click(infoSprinkle);
    await screen.findByText("Estimated cost of completed tasks so far.");
  });

  it("shows child patches tooltip when child versions exist", async () => {
    const user = userEvent.setup();
    render(
      <Metadata
        version={{
          ...baseVersion,
          isPatch: true,
          cost: { __typename: "Cost", total: 50 },
          childVersions: [
            {
              __typename: "Version",
              id: "child1",
              revision: "abc",
              status: "started",
              taskCount: 1,
              baseVersion: null,
              parameters: [],
              projectMetadata: null,
            },
          ],
          patch: {
            __typename: "Patch",
            id: "patch",
            patchNumber: 123,
            githubPatchData: null,
            includedLocalModules: [],
          },
          finishTime: null,
        }}
      />,
      {
        route: "/version/version123",
        path: "/version/:id",
        wrapper,
      },
    );
    const infoSprinkle = screen.getByRole("button", { name: "More info" });
    await user.click(infoSprinkle);
    await screen.findByText(
      "Estimated cost of completed tasks so far, including child patches.",
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
        route: "/version/version123",
        path: "/version/:id",
        wrapper,
      },
    );
    const infoSprinkle = screen.getByRole("button", { name: "More info" });
    await user.click(infoSprinkle);
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
        route: "/version/version123",
        path: "/version/:id",
        wrapper,
      },
    );
    expect(screen.queryByTestId("cost-details-button")).not.toBeInTheDocument();
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
        route: "/version/version123",
        path: "/version/:id",
        wrapper,
      },
    );
    expect(screen.getByTestId("cost-details-button")).toBeInTheDocument();
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
        route: "/version/version123",
        path: "/version/:id",
        wrapper,
      },
    );
    await user.click(screen.getByTestId("cost-details-button"));
    expect(screen.getByTestId("cost-modal")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close modal" }));
    expect(screen.queryByTestId("cost-modal")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("cost-details-button"));
    expect(screen.getByTestId("cost-modal")).toBeInTheDocument();
  });
});
