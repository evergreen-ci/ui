import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import { render, screen } from "@evg-ui/lib/test_utils";
import { TestStatus } from "@evg-ui/lib/types/test";
import { TestResult } from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { LogsColumn } from "./LogsColumn";

vi.mock("analytics", () => ({
  useTaskAnalytics: () => ({ sendEvent: vi.fn() }),
}));

const renderLogsColumn = (logs: NonNullable<TestResult["logs"]>) => {
  const testResult: TestResult = {
    id: "test-id",
    isManuallyQuarantined: false,
    logs,
    status: TestStatus.Pass,
    taskId: taskQuery.task.id,
    testFile: "test-file",
  };
  const { Component } = RenderFakeToastContext(
    <LogsColumn task={taskQuery.task} testResult={testResult} />,
  );

  render(<Component />);
};

describe("LogsColumn", () => {
  it("renders HTTP(S) log URLs", () => {
    renderLogsColumn({
      urlParsley: "https://example.com/parsley",
      urlRaw: "http://example.com/raw",
    });

    expect(screen.getByDataCy("test-table-parsley-btn")).toHaveAttribute(
      "href",
      "https://example.com/parsley",
    );
    expect(screen.getByDataCy("test-table-raw-btn")).toHaveAttribute(
      "href",
      "http://example.com/raw",
    );
    expect(screen.getByDataCy("test-table-download-btn")).toBeVisible();
  });

  it("does not render controls for unsafe log URLs", () => {
    renderLogsColumn({
      urlParsley: "javascript:alert(document.domain)",
      urlRaw: "data:text/html,<script>alert(document.domain)</script>",
    });

    expect(
      screen.queryByDataCy("test-table-parsley-btn"),
    ).not.toBeInTheDocument();
    expect(screen.queryByDataCy("test-table-raw-btn")).not.toBeInTheDocument();
    expect(
      screen.queryByDataCy("test-table-download-btn"),
    ).not.toBeInTheDocument();
  });
});
