import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { TaskStatus, TaskStatusUmbrella } from "@evg-ui/lib/types";
import { getVersionRoute } from "constants/routes";
import { GroupedTaskStatusBadge } from ".";

describe("groupedTaskStatusBadgeIcon", () => {
  const versionId = "version1";

  it("clicking on badge performs an action", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <GroupedTaskStatusBadge
        count={400}
        href={`/version/${versionId}`}
        onClick={onClick}
        status={TaskStatusUmbrella.SystemFailure}
      />,
      {
        path: "/version/:versionId/:tab",
        route: `/version/${versionId}/tasks`,
      },
    );
    const badge = screen.queryByDataCy("grouped-task-status-badge");
    expect(badge).toBeInTheDocument();
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.click(badge);
    expect(onClick).toHaveBeenCalledWith();
  });

  it("badge should have correct copy", () => {
    render(
      <GroupedTaskStatusBadge
        count={400}
        href={`/version/${versionId}`}
        status={TaskStatusUmbrella.SystemFailure}
      />,
    );
    expect(screen.getByText("System Failed")).toBeInTheDocument();
    expect(screen.getByText("400")).toBeInTheDocument();
  });

  it("should link to the passed in page", () => {
    render(
      <GroupedTaskStatusBadge
        count={400}
        href={getVersionRoute(versionId, {
          statuses: [TaskStatus.SystemFailed],
        })}
        status={TaskStatusUmbrella.SystemFailure}
      />,
    );
    expect(screen.queryByDataCy("grouped-task-status-badge")).toHaveAttribute(
      "href",
      `/version/${versionId}/tasks?statuses=system-failed`,
    );
  });

  it("badge should show tooltip when status counts is provided", async () => {
    const user = userEvent.setup();
    const statusCounts = {
      started: 30,
      failed: 15,
      unstarted: 5,
    };
    render(
      <GroupedTaskStatusBadge
        count={400}
        href={`/version/${versionId}`}
        status={TaskStatusUmbrella.SystemFailure}
        statusCounts={statusCounts}
      />,
    );
    await waitFor(() => {
      expect(
        screen.queryByDataCy("grouped-task-status-badge-tooltip"),
      ).toBeNull();
    });
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.hover(screen.queryByDataCy("grouped-task-status-badge"));
    await waitFor(() => {
      expect(
        screen.getByDataCy("grouped-task-status-badge-tooltip"),
      ).toBeVisible();
    });
    expect(screen.queryByText("30")).toBeVisible();
    expect(screen.queryByText("Running")).toBeVisible();
    expect(screen.queryByText("5")).toBeVisible();
    expect(screen.queryByText("Unstarted")).toBeVisible();
    expect(screen.queryByText("15")).toBeVisible();
    expect(screen.queryByText("Failed")).toBeVisible();
  });
});
