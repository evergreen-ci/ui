import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
} from "@evg-ui/lib/test_utils";
import { SkippedTestsMetadata } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider>{children}</MockedProvider>
);

describe("SkippedTestsMetadata", () => {
  it("renders nothing when test selection is disabled and no tests were skipped", () => {
    render(
      <SkippedTestsMetadata
        count={0}
        execution={0}
        latestExecution={0}
        taskId="t1"
        testSelectionEnabled={false}
      />,
      { wrapper },
    );
    expect(screen.queryByDataCy("skipped-tests-metadata")).toBeNull();
  });

  it("shows an unlinked zero badge when test selection ran and skipped nothing", () => {
    render(
      <SkippedTestsMetadata
        count={0}
        execution={0}
        latestExecution={0}
        taskId="t1"
        testSelectionEnabled
      />,
      { wrapper },
    );
    expect(
      screen.getByDataCy("skipped-tests-metadata-badge"),
    ).toHaveTextContent("0");
    expect(screen.queryByDataCy("skipped-tests-metadata-link")).toBeNull();
  });

  it("links a nonzero count to the Tests tab with the modal deep link", () => {
    render(
      <SkippedTestsMetadata
        count={4}
        execution={2}
        latestExecution={2}
        taskId="t1"
        testSelectionEnabled
      />,
      { wrapper },
    );
    expect(
      screen.getByDataCy("skipped-tests-metadata-badge"),
    ).toHaveTextContent("4");
    const href = screen
      .getByDataCy("skipped-tests-metadata-link")
      .getAttribute("href");
    expect(href).toContain("/task/t1/tests");
    expect(href).toContain("execution=2");
    expect(href).toContain("skippedTests=true");
  });

  it("shows an unlinked nonzero badge for an older execution", () => {
    render(
      <SkippedTestsMetadata
        count={4}
        execution={1}
        latestExecution={2}
        taskId="t1"
        testSelectionEnabled
      />,
      { wrapper },
    );
    expect(
      screen.getByDataCy("skipped-tests-metadata-badge"),
    ).toHaveTextContent("4");
    expect(screen.queryByDataCy("skipped-tests-metadata-link")).toBeNull();
  });
});
