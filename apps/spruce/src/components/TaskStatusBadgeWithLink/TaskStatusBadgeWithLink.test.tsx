import { renderWithRouterMatch, screen } from "@evg-ui/lib/test_utils";
import { TaskStatus } from "@evg-ui/lib/types/task";
import TaskStatusBadgeWithLink from ".";

describe("TaskStatusBadgeWithLink", () => {
  it("should render a link if a task id is passed", () => {
    renderWithRouterMatch(
      <TaskStatusBadgeWithLink execution={0} id="123" status="success" />,
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
  it("should pluralize the status", () => {
    const { rerender } = renderWithRouterMatch(
      <TaskStatusBadgeWithLink status={TaskStatus.Succeeded} taskCount={2} />,
    );
    expect(screen.getByText("2 Succeededs")).toBeInTheDocument();
    rerender(
      <TaskStatusBadgeWithLink status={TaskStatus.Succeeded} taskCount={1} />,
    );
    expect(screen.getByText("1 Succeeded")).toBeInTheDocument();
    rerender(
      <TaskStatusBadgeWithLink status={TaskStatus.Failed} taskCount={0} />,
    );
  });
});
