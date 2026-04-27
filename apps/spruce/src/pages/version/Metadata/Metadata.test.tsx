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
  project: "evergreen",
  projectIdentifier: "evergreen",
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
  projectMetadata: null,
  upstreamProject: null,
  user: { __typename: "User", displayName: "Test User", userId: "testuser" },
  versionTiming: null,
};

describe("version metadata cost display", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  it("ShowsCostRowWithZeroWhenCostIsNull", () => {
    render(<Metadata version={baseVersion} />, {
      route: "/version/version123",
      path: "/version/:id",
      wrapper,
    });
    expect(screen.getByDataCy("version-metadata-cost")).toBeInTheDocument();
    expect(screen.getByDataCy("version-metadata-cost")).toHaveTextContent("$0");
  });

  it("ShowsActualCostValueWhenCostIsSet", () => {
    const version: Version = {
      ...baseVersion,
      cost: { __typename: "Cost", total: 321.45 },
      status: PatchStatus.Success,
    };
    render(<Metadata version={version} />, {
      route: "/version/version123",
      path: "/version/:id",
      wrapper,
    });
    expect(screen.getByDataCy("version-metadata-cost")).toHaveTextContent(
      "$321.45",
    );
  });

  it("ShowsEstimateTooltipWhenVersionIsNotComplete", async () => {
    const user = userEvent.setup();
    render(
      <Metadata version={{ ...baseVersion, status: PatchStatus.Started }} />,
      {
        route: "/version/version123",
        path: "/version/:id",
        wrapper,
      },
    );
    const costWrapper = screen.getByDataCy(
      "version-metadata-cost",
    ).parentElement!;
    await user.hover(within(costWrapper).getByTestId("info-sprinkle-icon"));
    await screen.findByText("Estimated cost of completed tasks so far.");
  });

  it("ShowsCompleteTooltipWhenVersionIsComplete", async () => {
    const user = userEvent.setup();
    render(
      <Metadata
        version={{
          ...baseVersion,
          cost: { __typename: "Cost", total: 100 },
          status: PatchStatus.Success,
        }}
      />,
      {
        route: "/version/version123",
        path: "/version/:id",
        wrapper,
      },
    );
    const costWrapper = screen.getByDataCy(
      "version-metadata-cost",
    ).parentElement!;
    await user.hover(within(costWrapper).getByTestId("info-sprinkle-icon"));
    await screen.findByText("Total cost of all completed tasks.");
  });
});
