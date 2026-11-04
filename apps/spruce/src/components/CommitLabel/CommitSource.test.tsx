import {
  MockedProviderProps,
  renderWithRouterMatch,
  screen,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  VersionUpstreamProjectQuery,
  VersionUpstreamProjectQueryVariables,
} from "gql/generated/types";
import { VERSION_UPSTREAM_PROJECT } from "gql/queries";
import { MockedProvider } from "test_utils/graphql";
import { ProjectTriggerLevel } from "types/triggers";
import { CommitSource } from "./CommitSource";

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
          owner: "10gen",
          project: "upstream-project",
          repo: "dsi",
          revision: "9a3f1c7e5b2d48a6f0c1e3d5b7a9c2e4f6081a3d",
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
  describe("non-trigger commit", () => {
    it("links to the provided href", () => {
      renderComponent({ "data-testid": "hash" });
      expect(screen.getByTestId("hash")).toHaveAttribute("href", "/version/v1");
    });

    it("renders the base hash and repo without a separator", () => {
      renderComponent({ repo: { owner: "evergreen-ci", repo: "ui" } });
      expect(screen.getByText("abcdef1")).toBeVisible();
      expect(screen.getByText("in evergreen-ci/ui")).toBeVisible();
      expect(screen.queryByTestId("separator")).toBeNull();
    });

    it("does not render upstream project", () => {
      renderComponent();
      expect(screen.queryByText(/Module:/)).toBeNull();
      expect(screen.queryByText(/^in /)).toBeNull();
    });
  });

  describe("trigger commit", () => {
    it("renders the module label and link", async () => {
      renderComponent({ isTrigger: true }, [upstreamProjectMock]);
      expect(screen.getByText(/Module:/)).toBeVisible();
      expect(
        await screen.findByRole("link", { name: "upstream-project" }),
      ).toBeVisible();
    });

    it("renders the upstream hash and module repo", async () => {
      renderComponent(
        { isTrigger: true, repo: { owner: "evergreen-ci", repo: "ui" } },
        [upstreamProjectMock],
      );
      expect(await screen.findByText("in 10gen/dsi")).toBeVisible();
      expect(screen.getByText("9a3f1c7")).toBeVisible();
    });

    it("renders a separator between the module repo and the module", async () => {
      renderComponent({ isTrigger: true }, [upstreamProjectMock]);
      expect(await screen.findByTestId("separator")).toBeInTheDocument();
    });
  });
});
