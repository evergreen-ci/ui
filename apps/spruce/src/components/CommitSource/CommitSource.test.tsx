import {
  MockedProviderProps,
  renderWithRouterMatch,
  screen,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  VersionUpstreamProjectQuery,
  VersionUpstreamProjectQueryVariables,
} from "gql/generated/types";
import { VERSION_UPSTREAM_PROJECT } from "gql/queries";
import { MockedProvider } from "test_utils/graphql";
import { ProjectTriggerLevel } from "types/triggers";
import { CommitSource } from ".";

const upstreamProjectMock: ApolloMock<
  VersionUpstreamProjectQuery,
  VersionUpstreamProjectQueryVariables
> = {
  request: {
    query: VERSION_UPSTREAM_PROJECT,
    variables: { versionId: "v1" },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        id: "v1",
        upstreamProject: {
          __typename: "UpstreamProject",
          owner: "evergreen-ci",
          project: "upstream-project",
          repo: "evergreen",
          revision: "abc123",
          task: {
            __typename: "Task",
            id: "upstream_task",
            displayName: "compile",
            execution: 0,
          },
          triggerID: "trigger",
          triggerType: ProjectTriggerLevel.TASK,
          version: { __typename: "Version", id: "upstream_version" },
        },
      },
    },
  },
};

const renderComponent = (
  props: Partial<React.ComponentProps<typeof CommitSource>> = {},
  mocks: MockedProviderProps["mocks"] = [],
) =>
  renderWithRouterMatch(
    <MockedProvider mocks={mocks}>
      <CommitSource
        hashHref="/version/v1"
        isTrigger={false}
        revision="abcdef123456"
        versionId="v1"
        {...props}
      />
    </MockedProvider>,
  );

describe("CommitSource", () => {
  it("links to the provided href", () => {
    renderComponent({ "data-testid": "hash" });
    expect(screen.getByTestId("hash")).toHaveAttribute("href", "/version/v1");
  });

  it("renders only the hash when it is not a trigger and has no repo", () => {
    renderComponent();
    expect(screen.queryByText(/Module:/)).toBeNull();
    expect(screen.queryByText(/^in /)).toBeNull();
  });

  it("renders the repo without a separator for non-trigger versions", () => {
    renderComponent({ repo: { owner: "evergreen-ci", repo: "ui" } });
    expect(screen.getByText("in evergreen-ci/ui")).toBeVisible();
    expect(screen.queryByTestId("separator")).toBeNull();
  });

  it("renders the module label immediately and the link once the upstream project loads", async () => {
    renderComponent({ isTrigger: true }, [upstreamProjectMock]);
    expect(screen.getByText(/Module:/)).toBeVisible();
    expect(screen.queryByRole("link", { name: "upstream-project" })).toBeNull();
    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: "upstream-project" }),
      ).toBeVisible();
    });
    expect(screen.queryByTestId("separator")).toBeNull();
  });

  it("renders a separator between the repo and the module", () => {
    renderComponent(
      { isTrigger: true, repo: { owner: "evergreen-ci", repo: "ui" } },
      [upstreamProjectMock],
    );
    expect(screen.getByTestId("separator")).toBeInTheDocument();
  });
});
