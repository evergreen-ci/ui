import { renderWithRouterMatch, screen } from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { Requester } from "constants/requesters";
import {
  VersionUpstreamProjectQuery,
  VersionUpstreamProjectQueryVariables,
} from "gql/generated/types";
import { VERSION_UPSTREAM_PROJECT } from "gql/queries";
import { MockedProvider } from "test_utils/graphql";
import { ProjectTriggerLevel } from "types/triggers";
import { CommitSource } from "./CommitSource";

type Props = React.ComponentProps<typeof CommitSource>;

const commitVersion: Props["version"] = {
  id: "v1",
  projectMetadata: { owner: "evergreen-ci", repo: "ui" },
  requester: Requester.Gitter,
  revision: "abcdef123456",
};

const triggerVersion: Props["version"] = {
  ...commitVersion,
  requester: Requester.Trigger,
};

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
          repo: "docs",
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

const renderComponent = (props: Partial<Props> = {}) =>
  renderWithRouterMatch(
    <MockedProvider mocks={[upstreamProjectMock]}>
      <CommitSource hashHref="/version/v1" version={commitVersion} {...props} />
    </MockedProvider>,
  );

describe("commitSource", () => {
  describe("non-trigger version", () => {
    it("links the hash to the provided href", () => {
      renderComponent({ "data-testid": "hash", version: commitVersion });
      expect(screen.getByTestId("hash")).toHaveAttribute("href", "/version/v1");
    });

    it("renders the version's own hash and no module", () => {
      renderComponent({ version: commitVersion });
      expect(screen.getByText("abcdef1")).toBeVisible();
      expect(screen.queryByText(/Triggered by:/)).not.toBeInTheDocument();
    });

    it("renders the version's own repo only when showRepo is set", () => {
      renderComponent({ showRepo: true, version: commitVersion });
      expect(screen.getByText("in evergreen-ci/ui")).toBeVisible();
      expect(screen.getByTestId("github-link")).toHaveAttribute(
        "href",
        "https://github.com/evergreen-ci/ui/commit/abcdef123456",
      );
      expect(screen.queryByTestId("separator")).not.toBeInTheDocument();
    });

    it("does not render a repo by default", () => {
      renderComponent({ version: commitVersion });
      expect(screen.queryByText(/^in /)).not.toBeInTheDocument();
    });
  });

  describe("trigger version", () => {
    it("renders the upstream hash and a link to the module", async () => {
      renderComponent({ version: triggerVersion });
      expect(screen.getByText(/Triggered by:/)).toBeVisible();
      expect(
        await screen.findByRole("link", { name: "upstream-project" }),
      ).toBeVisible();
      expect(screen.getByText("9a3f1c7")).toBeVisible();
    });

    it("renders the upstream repo, linked to the upstream commit, and a separator when showRepo is set", async () => {
      renderComponent({ showRepo: true, version: triggerVersion });
      expect(await screen.findByText("in 10gen/docs")).toBeVisible();
      expect(screen.getByTestId("github-link")).toHaveAttribute(
        "href",
        "https://github.com/10gen/docs/commit/9a3f1c7e5b2d48a6f0c1e3d5b7a9c2e4f6081a3d",
      );
      expect(screen.getByTestId("separator")).toBeInTheDocument();
    });

    it("does not render a repo or separator by default", async () => {
      renderComponent({ version: triggerVersion });
      expect(
        await screen.findByRole("link", { name: "upstream-project" }),
      ).toBeVisible();
      expect(screen.queryByText(/^in /)).not.toBeInTheDocument();
      expect(screen.queryByTestId("separator")).not.toBeInTheDocument();
    });
  });
});
