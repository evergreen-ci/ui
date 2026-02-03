import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { TaskStatus } from "@evg-ui/lib/types";
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

    expect(screen.getByDataCy("history-table-icon")).toHaveAttribute(
      "data-status",
      "success",
    );
    expect(screen.getByDataCy("task-cell")).toBeInTheDocument();

    rerender(
      <TaskCell
        loading={false}
        task={{
          id: "some-task-id",
          displayStatus: TaskStatus.Failed,
        }}
      />,
    );
    expect(screen.getByLabelText("Failure Icon")).toBeInTheDocument();
    expect(screen.getByDataCy("task-cell")).toBeInTheDocument();
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
    expect(screen.queryByDataCy("task-cell")).toHaveStyle("opacity: 0.4");
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

  it("should have a tooltip on hover with failing tests when they are supplied", async () => {
    const user = userEvent.setup();
    render(
      <TaskCell
        failingTests={["some-test"]}
        loading={false}
        task={{
          id: "some-task-id",
          displayStatus: TaskStatus.Failed,
        }}
      />,
    );
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.hover(screen.queryByDataCy("history-table-icon"));
    await screen.findByText("some-test");
    expect(screen.getByDataCy("test-tooltip")).toBeInTheDocument();
    expect(screen.getByText("some-test")).toBeInTheDocument();
  });
});
