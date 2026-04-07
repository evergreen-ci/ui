import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { VersionQuery } from "gql/generated/types";
import { getUserMock } from "gql/mocks/getUser";
import { Metadata } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[getUserMock]}>{children}</MockedProvider>
);

describe("version metadata cost", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  it("RendersCostRowAndDetailsButtonWhenCostIsPresent", async () => {
    const user = userEvent.setup();
    render(<Metadata version={versionWithCost} />, {
      route: `/version/${versionId}`,
      path: "/version/:id",
      wrapper,
    });
    expect(screen.getByDataCy("version-metadata-cost")).toBeInTheDocument();
    const detailsButton = screen.getByDataCy("cost-details-button");
    expect(detailsButton).toBeInTheDocument();
    await user.click(detailsButton);
    expect(screen.getByDataCy("cost-modal")).toBeInTheDocument();
  });

  it("DoesNotRenderCostRowWhenCostAndPredictedCostAreNull", () => {
    render(<Metadata version={versionWithNullCost} />, {
      route: `/version/${versionId}`,
      path: "/version/:id",
      wrapper,
    });
    expect(screen.queryByDataCy("version-metadata-cost")).toBeNull();
    expect(screen.queryByDataCy("cost-details-button")).toBeNull();
  });

  it("RendersCostRowWhenOnlyPredictedCostIsPresent", () => {
    render(<Metadata version={versionWithPredictedCost} />, {
      route: `/version/${versionId}`,
      path: "/version/:id",
      wrapper,
    });
    expect(screen.getByDataCy("version-metadata-cost")).toBeInTheDocument();
    expect(screen.getByDataCy("cost-details-button")).toBeInTheDocument();
  });

  it("ShowsEstimatedTooltipWhenVersionIsRunning", async () => {
    const user = userEvent.setup();
    render(<Metadata version={versionWithPredictedCost} />, {
      route: `/version/${versionId}`,
      path: "/version/:id",
      wrapper,
    });
    await user.hover(screen.getByDataCy("version-metadata-cost"));
    await screen.findByText(
      "Estimated cost based on tasks completed so far. Updates as tasks complete.",
    );
  });

  it("ShowsFinalTooltipWhenVersionIsFinished", async () => {
    const user = userEvent.setup();
    render(<Metadata version={versionWithCost} />, {
      route: `/version/${versionId}`,
      path: "/version/:id",
      wrapper,
    });
    await user.hover(screen.getByDataCy("version-metadata-cost"));
    await screen.findByText(
      "Final cumulative cost of all tasks in this version.",
    );
  });

  it("AlwaysRendersHoneycombPatchCostLink", () => {
    render(<Metadata version={versionWithNullCost} />, {
      route: `/version/${versionId}`,
      path: "/version/:id",
      wrapper,
    });
    expect(screen.getByDataCy("honeycomb-patch-cost-link")).toBeInTheDocument();
  });
});

const versionId = "version_abc123";

const baseVersion: NonNullable<VersionQuery["version"]> = {
  __typename: "Version",
  id: versionId,
  activated: null,
  message: "my patch",
  isPatch: true,
  requester: "gitter_request",
  status: "created",
  revision: "abc123def456",
  createTime: new Date("2024-01-01T00:00:00"),
  startTime: null,
  finishTime: null,
  taskCount: 10,
  warnings: [],
  errors: [],
  ignored: false,
  order: 1,
  project: "mongodb-mongo-master",
  repo: "mongo",
  projectIdentifier: "mongodb-mongo-master",
  user: { __typename: "User", displayName: "Test User", userId: "testuser" },
  versionTiming: null,
  baseVersion: null,
  cost: null,
  predictedCost: null,
  externalLinksForMetadata: [],
  gitTags: null,
  manifest: null,
  parameters: [],
  patch: null,
  previousVersion: null,
  projectMetadata: {
    __typename: "Project",
    id: "project_id",
    owner: "mongodb",
    repo: "mongo",
    branch: "main",
  },
  upstreamProject: null,
};

const versionWithCost: NonNullable<VersionQuery["version"]> = {
  ...baseVersion,
  cost: {
    __typename: "Cost",
    adjustedEC2Cost: 2.5,
    adjustedEBSThroughputCost: 0.5,
    adjustedEBSStorageCost: 0.1,
    s3ArtifactPutCost: 0.05,
    s3LogPutCost: 0.02,
    onDemandEC2Cost: 3.0,
    s3ArtifactStorageCost: null,
  },
};

const versionWithPredictedCost: NonNullable<VersionQuery["version"]> = {
  ...baseVersion,
  cost: null,
  predictedCost: {
    __typename: "Cost",
    adjustedEC2Cost: 1.0,
    adjustedEBSThroughputCost: 0.2,
    adjustedEBSStorageCost: 0.05,
    s3ArtifactPutCost: 0.01,
    s3LogPutCost: 0.01,
    onDemandEC2Cost: 1.5,
    s3ArtifactStorageCost: null,
  },
};

const versionWithNullCost: NonNullable<VersionQuery["version"]> = {
  ...baseVersion,
  cost: null,
  predictedCost: null,
};
