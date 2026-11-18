import { render, screen } from "@evg-ui/lib/test_utils";
import { JobLogsTable } from "./JobLogsTable";
import { EvergreenTestResult } from "./types";

vi.mock("analytics/joblogs/useJobLogsAnalytics", () => ({
  useJobLogsAnalytics: () => ({ sendEvent: vi.fn() }),
}));

describe("JobLogsTable", () => {
  it("renders test results in a table", () => {
    render(
      <JobLogsTable
        loading={false}
        tests={[
          {
            logs: { urlParsley: "https://example.com/parsley" },
            status: "pass",
            testFile: "passing-test",
          } as EvergreenTestResult,
        ]}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByTestId("via-table-row")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "passing-test" })).toHaveAttribute(
      "href",
      "https://example.com/parsley",
    );
    expect(screen.getByText("Pass")).toBeInTheDocument();
  });

  it("renders the empty state when no results exist", () => {
    render(<JobLogsTable loading={false} tests={[]} />);

    expect(screen.getByText("No logs found for this job.")).toBeInTheDocument();
  });
});
