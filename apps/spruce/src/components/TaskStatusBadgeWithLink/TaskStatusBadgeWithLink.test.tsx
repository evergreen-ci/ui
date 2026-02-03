import { renderWithRouterMatch, screen } from "@evg-ui/lib/test_utils";
import { TaskStatus } from "@evg-ui/lib/types";
import TaskStatusBadgeWithLink from ".";

describe("TaskStatusBadgeWithLink", () => {
  it("should render a link if a task id is passed", () => {
    renderWithRouterMatch(
      <TaskStatusBadgeWithLink
        execution={0}
        id="123"
        status={TaskStatus.Succeeded}
      />,
    );
    expect(screen.getByDataCy("task-status-badge")).toBeInTheDocument();
    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/task/123?execution=0",
    );
  });
  it("should render a link to the annotations tab if the status is known issue", () => {
    renderWithRouterMatch(
      <TaskStatusBadgeWithLink
        execution={0}
        id="123"
        status={TaskStatus.KnownIssue}
      />,
    );
    expect(screen.getByDataCy("task-status-badge")).toBeInTheDocument();
    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/task/123/annotations?execution=0",
    );
  });
});
