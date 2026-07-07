import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
} from "@evg-ui/lib/test_utils";
import { QuarantinedTestsSkipped } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider>{children}</MockedProvider>
);

describe("QuarantinedTestsSkipped", () => {
  it("renders nothing when test selection is disabled and no tests were skipped", () => {
    render(
      <QuarantinedTestsSkipped
        count={0}
        execution={0}
        taskId="t1"
        testSelectionEnabled={false}
      />,
      { wrapper },
    );
    expect(screen.queryByDataCy("quarantined-test-skips")).toBeNull();
  });

  it("shows an unlinked zero badge when test selection ran and skipped nothing", () => {
    render(
      <QuarantinedTestsSkipped
        count={0}
        execution={0}
        taskId="t1"
        testSelectionEnabled
      />,
      { wrapper },
    );
    expect(
      screen.getByDataCy("quarantined-test-skips-badge"),
    ).toHaveTextContent("0");
    expect(screen.queryByDataCy("quarantined-test-skips-link")).toBeNull();
  });

  it("links a nonzero count to the Tests tab with the modal deep link", () => {
    render(
      <QuarantinedTestsSkipped
        count={4}
        execution={2}
        taskId="t1"
        testSelectionEnabled
      />,
      { wrapper },
    );
    expect(
      screen.getByDataCy("quarantined-test-skips-badge"),
    ).toHaveTextContent("4");
    const href = screen
      .getByDataCy("quarantined-test-skips-link")
      .getAttribute("href");
    expect(href).toContain("/task/t1/tests");
    expect(href).toContain("execution=2");
    expect(href).toContain("quarantinedTests=true");
  });
});
