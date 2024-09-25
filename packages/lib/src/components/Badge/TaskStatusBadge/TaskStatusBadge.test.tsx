import { renderWithRouterMatch, screen } from "test_utils";
import { TaskStatus } from "types/task";
import TaskStatusBadge from ".";

describe("TaskStatusBadge", () => {
  it("should pluralize the status", () => {
    const { rerender } = renderWithRouterMatch(
      <TaskStatusBadge status={TaskStatus.Succeeded} taskCount={2} />,
    );
    expect(screen.getByText("2 Succeededs")).toBeInTheDocument();
    rerender(<TaskStatusBadge status={TaskStatus.Succeeded} taskCount={1} />);
    expect(screen.getByText("1 Succeeded")).toBeInTheDocument();
    rerender(<TaskStatusBadge status={TaskStatus.Failed} taskCount={2} />);
    expect(screen.getByText("2 Faileds")).toBeInTheDocument();
  });
});
