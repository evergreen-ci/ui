import { render, screen } from "@evg-ui/lib/test_utils";
import { Requester } from "constants/requesters";
import { ProjectTriggerLevel } from "types/triggers";
import { CommitSource } from "./CommitSource";

type Props = React.ComponentProps<typeof CommitSource>;

const commitVersion: Props["version"] = {
  id: "v1",
  projectMetadata: { owner: "evergreen-ci", repo: "ui" },
  requester: Requester.Gitter,
  revision: "abcdef123456",
  upstreamProject: null,
};

const triggerVersion: Props["version"] = {
  ...commitVersion,
  requester: Requester.Trigger,
  upstreamProject: {
    owner: "10gen",
    project: "upstream-project",
    repo: "docs",
    revision: "9a3f1c7e5b2d48a6f0c1e3d5b7a9c2e4f6081a3d",
    task: {
      id: "upstream_task",
      displayName: "compile",
      execution: 0,
    },
    triggerID: "trigger",
    triggerType: ProjectTriggerLevel.TASK,
    version: { id: "upstream_version" },
  },
};

const renderComponent = (props: Partial<Props> = {}) =>
  render(
    <CommitSource hashHref="/version/v1" version={commitVersion} {...props} />,
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
    it("renders the upstream hash and a link to the module", () => {
      renderComponent({ version: triggerVersion });
      expect(screen.getByText(/Triggered by:/)).toBeVisible();
      expect(
        screen.getByRole("link", { name: "upstream-project" }),
      ).toBeVisible();
      expect(screen.getByText("9a3f1c7")).toBeVisible();
      expect(screen.queryByText("abcdef1")).not.toBeInTheDocument();
    });

    it("renders the upstream repo, linked to the upstream commit, and a separator when showRepo is set", () => {
      renderComponent({ showRepo: true, version: triggerVersion });
      expect(screen.getByText("in 10gen/docs")).toBeVisible();
      expect(screen.getByTestId("github-link")).toHaveAttribute(
        "href",
        "https://github.com/10gen/docs/commit/9a3f1c7e5b2d48a6f0c1e3d5b7a9c2e4f6081a3d",
      );
      expect(screen.getByTestId("separator")).toBeInTheDocument();
    });

    it("does not render a repo or separator by default", () => {
      renderComponent({ version: triggerVersion });
      expect(screen.queryByText(/^in /)).not.toBeInTheDocument();
      expect(screen.queryByTestId("separator")).not.toBeInTheDocument();
    });
  });
});
