import {
  MockedProvider,
  renderWithRouterMatch,
  screen,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import CommitChartLabel from ".";

// @ts-expect-error: FIXME. This comment was added by an automated script.
const RenderCommitChartLabel = ({ version }) => (
  <MockedProvider mocks={[getSpruceConfigMock]}>
    <CommitChartLabel
      author={version.author}
      createTime={version.createTime}
      githash={shortenGithash(version.revision) || ""}
      gitTags={[
        { tag: "v1.2.3", pusher: "release-bot" },
        { tag: "v1.2.3-rc0", pusher: "release-bot" },
      ]}
      message={version.message}
      versionId={version.id}
    />
  </MockedProvider>
);

describe("commitChartLabel", () => {
  it("displays author, githash and createTime", () => {
    renderWithRouterMatch(<RenderCommitChartLabel version={versionShort} />);
    expect(screen.queryByTestId("githash-link")).toHaveTextContent("4137c33");
    expect(screen.queryByTestId("commit-label")).toHaveTextContent(
      /Mohamed Khelif · SERVER-57332 Create skeleton InternalGit Tags: v1.2.3, v1.2.3-rc0/,
    );
  });

  it("githash links to version page", () => {
    renderWithRouterMatch(<RenderCommitChartLabel version={versionShort} />);
    expect(screen.queryByTestId("githash-link")).toHaveAttribute(
      "href",
      "/version/123/tasks",
    );
  });

  it("jira ticket links to Jira website", async () => {
    renderWithRouterMatch(<RenderCommitChartLabel version={versionShort} />);
    await waitFor(() => {
      expect(screen.queryByTestId("jira-link")).toHaveAttribute(
        "href",
        "https://jira.mongodb.org/browse/SERVER-57332",
      );
    });
  });

  it("displays the entire commit message and exposes it via title", () => {
    renderWithRouterMatch(<RenderCommitChartLabel version={versionLong} />);
    expect(screen.queryByTestId("commit-label")).toHaveTextContent(
      "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    );
    expect(screen.getByTitle(versionLong.message)).toBeInTheDocument();
  });

  it("displays git tags", () => {
    renderWithRouterMatch(<RenderCommitChartLabel version={versionShort} />);
    expect(screen.getByText(/v1.2.3/)).toBeInTheDocument();
    expect(screen.getByText(/v1.2.3-rc0/)).toBeInTheDocument();
  });
});

const versionShort = {
  id: "123",
  createTime: new Date("2021-06-16T23:38:13Z"),
  message: "SERVER-57332 Create skeleton Internal",
  order: 39365,
  author: "Mohamed Khelif",
  revision: "4137c33fa4a0d5c747a1115f0853b5f70e46f112",
};
const versionLong = {
  id: "123",
  createTime: new Date("2021-06-16T23:38:13Z"),
  message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
  order: 39365,
  author: "Mohamed Khelif",
  revision: "4137c33fa4a0d5c747a1115f0853b5f70e46f112",
};
