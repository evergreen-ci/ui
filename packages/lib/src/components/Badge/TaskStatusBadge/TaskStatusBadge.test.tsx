import { render, screen } from "test_utils";
import { TaskStatus } from "types/task";
import TaskStatusBadge from ".";

describe("TaskStatusBadge", () => {
  it("should render a badge with the expected status", () => {
    render(<TaskStatusBadge status={TaskStatus.Succeeded} />);
    expect(screen.getByDataCy("task-status-badge")).toBeInTheDocument();
    expect(screen.getByText("Succeeded")).toBeInTheDocument();
  });
  it("should render a badge with a task count if a count is provided", () => {
    render(<TaskStatusBadge status={TaskStatus.KnownIssue} taskCount={2} />);
    expect(screen.getByDataCy("task-status-badge")).toBeInTheDocument();
    expect(screen.getByText("2 Known Issue")).toBeInTheDocument();
  });
});
