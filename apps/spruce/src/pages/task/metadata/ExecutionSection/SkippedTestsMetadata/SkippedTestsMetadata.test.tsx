import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  TaskQuarantinedTestsSampleQuery,
  TaskQuarantinedTestsSampleQueryVariables,
} from "gql/generated/types";
import { TASK_QUARANTINED_TESTS_SAMPLE } from "gql/queries";
import { SkippedTestsMetadata } from ".";

const sampleMock: ApolloMock<
  TaskQuarantinedTestsSampleQuery,
  TaskQuarantinedTestsSampleQueryVariables
> = {
  request: {
    query: TASK_QUARANTINED_TESTS_SAMPLE,
    variables: { versionId: "v1", taskIds: ["t1"], limit: 50 },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        id: "v1",
        taskQuarantinedTestsSample: [
          {
            __typename: "TaskQuarantinedTestsSample",
            execution: 2,
            quarantinedTests: [
              {
                __typename: "QuarantinedTest",
                displayTestName: null,
                testName: "test_one",
              },
            ],
            quarantinedTestsSkippedCount: 4,
            taskId: "t1",
          },
        ],
      },
    },
  },
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[sampleMock]}>{children}</MockedProvider>
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
        versionId="v1"
      />,
      { wrapper },
    );
    expect(screen.queryByTestId("skipped-tests-metadata")).toBeNull();
  });

  it("shows a zero count without a Details button when test selection skipped nothing", () => {
    render(
      <SkippedTestsMetadata
        count={0}
        execution={0}
        latestExecution={0}
        taskId="t1"
        testSelectionEnabled
        versionId="v1"
      />,
      { wrapper },
    );
    expect(
      screen.getByTestId("skipped-tests-metadata-count"),
    ).toHaveTextContent("0 tests");
    const detailsButton = screen.queryByRole("button", { name: "Details" });
    expect(detailsButton).toBeNull();
  });

  it("opens details locally and resets them when the task changes", async () => {
    const user = userEvent.setup();
    RenderFakeToastContext();
    const { rerender } = render(
      <SkippedTestsMetadata
        key="t1-2"
        count={4}
        execution={2}
        latestExecution={2}
        taskId="t1"
        testSelectionEnabled
        versionId="v1"
      />,
      { wrapper },
    );
    expect(
      screen.getByTestId("skipped-tests-metadata-count"),
    ).toHaveTextContent("4 tests");
    const detailsButton = screen.getByRole("button", { name: "Details" });
    await user.click(detailsButton);
    expect(await screen.findByTestId("skipped-tests-modal")).toBeVisible();
    expect(await screen.findByText("test_one")).toBeVisible();

    rerender(
      <SkippedTestsMetadata
        key="t2-2"
        count={4}
        execution={2}
        latestExecution={2}
        taskId="t2"
        testSelectionEnabled
        versionId="v2"
      />,
    );
    expect(screen.queryByTestId("skipped-tests-modal")).toBeNull();
  });

  it("shows a nonzero count without a Details button for an older execution", () => {
    render(
      <SkippedTestsMetadata
        count={4}
        execution={1}
        latestExecution={2}
        taskId="t1"
        testSelectionEnabled
        versionId="v1"
      />,
      { wrapper },
    );
    expect(
      screen.getByTestId("skipped-tests-metadata-count"),
    ).toHaveTextContent("4 tests");
    const detailsButton = screen.queryByRole("button", { name: "Details" });
    expect(detailsButton).toBeNull();
  });
});
