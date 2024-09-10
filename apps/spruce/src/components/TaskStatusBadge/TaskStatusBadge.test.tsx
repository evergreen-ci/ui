import { renderWithRouterMatch, screen } from "@evg-ui/lib/test_utils";
import { TaskStatus } from "@evg-ui/lib/types/task";
import TaskStatusBadge from ".";

describe("taskStatusBadge", () => {
  it("should render", () => {
    renderWithRouterMatch(<TaskStatusBadge status="success" />);
    expect(screen.getByDataCy("task-status-badge")).toBeInTheDocument();
  });
  it("should render a badge if no task id is passed", () => {
    renderWithRouterMatch(<TaskStatusBadge status="success" />);
    expect(screen.getByDataCy("task-status-badge")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
  it("should render a link if a task id is passed", () => {
    renderWithRouterMatch(
      <TaskStatusBadge execution={0} id="123" status="success" />,
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
      <TaskStatusBadge execution={0} id="123" status={TaskStatus.KnownIssue} />,
    );
    expect(screen.getByDataCy("task-status-badge")).toBeInTheDocument();
    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/task/123/annotations?execution=0",
    );
  });
});
