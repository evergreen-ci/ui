import {
  renderWithRouterMatch as render,
  screen,
} from "@evg-ui/lib/test_utils";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskCell } from ".";

describe("taskCell", () => {
  it("should render a task cell corresponding to a passed in status", () => {
    const { rerender } = render(
      <TaskCell
        loading={false}
        task={{
          id: "some-task-id",
          displayStatus: TaskStatus.Succeeded,
        }}
      />,
    );

    expect(
      screen.getByTestId("history-table-icon").querySelector("[data-status]"),
    ).toHaveAttribute("data-status", "success");
    expect(screen.getByTestId("task-cell")).toBeInTheDocument();

    rerender(
      <TaskCell
        loading={false}
        task={{
          id: "some-task-id",
          displayStatus: TaskStatus.Failed,
        }}
      />,
    );
    expect(
      screen.getByTestId("history-table-icon").querySelector("[data-status]"),
    ).toHaveAttribute("data-status", "failed");
    expect(screen.getByTestId("task-cell")).toBeInTheDocument();
  });

  it("should link to task page history tab", () => {
    render(
      <TaskCell
        loading={false}
        task={{
          id: "some-task-id",
          displayStatus: TaskStatus.Succeeded,
        }}
      />,
    );
    expect(screen.queryByRole("link")).toHaveAttribute(
      "href",
      "/task/some-task-id/history",
    );
  });

  it("should be transparent when it is inactive", () => {
    render(
      <TaskCell
        inactive
        loading={false}
        task={{
          id: "some-task-id",
          displayStatus: TaskStatus.Succeeded,
        }}
      />,
    );
    expect(screen.queryByTestId("task-cell")).toHaveStyle("opacity: 0.4");
  });

  it("should render a label when one is passed in", () => {
    render(
      <TaskCell
        label="some-label"
        task={{
          id: "some-task-id",
          displayStatus: TaskStatus.Failed,
        }}
      />,
    );
    expect(screen.getByText("some-label")).toBeInTheDocument();
  });
});
