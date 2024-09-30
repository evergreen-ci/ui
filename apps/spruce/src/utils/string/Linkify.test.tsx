import { render, screen } from "@evg-ui/lib/test_utils";
import { githubPRLinkify, jiraLinkify } from "./Linkify";

describe("githubPRLinkify", () => {
  it("linkifies a GitHub pull request link", () => {
    render(
      <span>
        {githubPRLinkify("https://github.com/evergreen-ci/ui/pull/413")}
      </span>,
    );
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("does not linkify if not a GitHub pull request", () => {
    render(<span>{githubPRLinkify("https://evergreen.mongodb.com")}</span>);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

describe("jiraLinkify", () => {
  it("linkifies a JIRA ticket", () => {
    render(<span>{jiraLinkify("DEVPROD-1234", "jira")}</span>);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("does not linkify if not a JIRA ticket", () => {
    render(<span>{jiraLinkify("devprod-1234", "jira")}</span>);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
