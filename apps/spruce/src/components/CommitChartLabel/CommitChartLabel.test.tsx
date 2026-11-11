import {
  MockedProvider,
  renderWithRouterMatch,
  screen,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { Requester } from "constants/requesters";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import CommitChartLabel from ".";

type Version = React.ComponentProps<typeof CommitChartLabel>["version"];

const version: Version = {
  id: "123",
  createTime: new Date("2021-06-16T23:38:13Z"),
  gitTags: [
    { tag: "v1.2.3", pusher: "release-bot" },
    { tag: "v1.2.3-rc0", pusher: "release-bot" },
  ],
  message: "SERVER-57332 Create skeleton Internal",
  order: 39365,
  requester: Requester.Gitter,
  revision: "4137c33fa4a0d5c747a1115f0853b5f70e46f112",
  user: { displayName: "Mohamed Khelif", userId: "mohamed.khelif" },
};

const renderCommitChartLabel = (overrides: Partial<Version> = {}) =>
  renderWithRouterMatch(
    <MockedProvider mocks={[getSpruceConfigMock]}>
      <CommitChartLabel version={{ ...version, ...overrides }} />
    </MockedProvider>,
  );

describe("commitChartLabel", () => {
  it("displays author, githash, message and git tags", () => {
    renderCommitChartLabel();
    expect(screen.getByTestId("githash-link")).toHaveTextContent("4137c33");
    expect(screen.getByTestId("commit-label")).toHaveTextContent(
      /Mohamed Khelif · SERVER-57332 Create skeleton InternalGit Tags: v1.2.3, v1.2.3-rc0/,
    );
  });

  it("links the githash to the version page", () => {
    renderCommitChartLabel();
    expect(screen.getByTestId("githash-link")).toHaveAttribute(
      "href",
      "/version/123/tasks",
    );
  });

  it("links the Jira ticket to the Jira website", async () => {
    renderCommitChartLabel();
    await waitFor(() => {
      expect(screen.getByTestId("jira-link")).toHaveAttribute(
        "href",
        "https://jira.mongodb.org/browse/SERVER-57332",
      );
    });
  });

  it("displays the entire commit message and exposes it via title", () => {
    const message =
      "SERVER-57332 Create skeleton InternalDocumentSourceDensify";
    renderCommitChartLabel({ message });
    expect(screen.getByTestId("commit-label")).toHaveTextContent(message);
    expect(screen.getByTitle(message)).toBeInTheDocument();
  });
});
