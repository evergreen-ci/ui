import {
  fireEvent,
  renderWithRouterMatch as render,
  screen,
} from "@evg-ui/lib/test_utils";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { ColumnHeaderCell, TaskCell } from ".";

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

  it("should have a tooltip on hover with failing tests when they are supplied", async () => {
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
    // jsdom can't lay out the tooltip's portal, so check presence not visibility.
    fireEvent.pointerMove(document.body);
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    fireEvent.pointerEnter(screen.queryByTestId("history-table-icon"));
    expect(
      await screen.findByTestId("test-tooltip", {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(screen.getByText("some-test")).toBeInTheDocument();
  });
});

describe("columnHeaderCell", () => {
  it("should show a tooltip with the full name when hovering over a truncated column header", async () => {
    render(
      <ColumnHeaderCell
        fullDisplayName="a-very-long-task-name-that-gets-truncated"
        trimmedDisplayName="a-very-long-t..."
      />,
    );
    fireEvent.pointerMove(document.body);
    fireEvent.pointerEnter(screen.getByText("a-very-long-t..."));
    expect(
      await screen.findByText(
        "a-very-long-task-name-that-gets-truncated",
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
  });

  it("should not render a tooltip when the display name is not truncated", () => {
    render(
      <ColumnHeaderCell
        fullDisplayName="short-name"
        trimmedDisplayName="short-name"
      />,
    );
    fireEvent.pointerMove(document.body);
    fireEvent.pointerEnter(screen.getByText("short-name"));
    expect(screen.queryAllByText("short-name")).toHaveLength(1);
  });
});
