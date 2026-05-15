import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { TestStatus } from "@evg-ui/lib/types/test";
import {
  QuarantineTestMutation,
  QuarantineTestMutationVariables,
  UnquarantineTestMutation,
  UnquarantineTestMutationVariables,
  TestResult,
} from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { QUARANTINE_TEST, UNQUARANTINE_TEST } from "gql/mutations";
import { ActionMenu } from ".";

const taskWithTestSelection = {
  ...taskQuery.task,
  testSelectionEnabled: true,
};

describe("action menu for tests table", () => {
  it("shows disabled message when test selection did not run for the task", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[]}>
        <ActionMenu
          task={{ ...taskWithTestSelection, testSelectionEnabled: false }}
          test={failingTest}
        />
      </MockedProvider>,
    );
    render(<Component />);
    await user.click(screen.getByDataCy("ellipsis-btn"));
    await waitFor(() => {
      expect(screen.getByDataCy("card-dropdown")).toBeVisible();
    });
    expect(
      screen.getByText(
        "Test selection did not run for this task, so its tests cannot be quarantined. Test selection is only available on patch builds for build variants and tasks configured for it.",
      ),
    ).toBeVisible();
  });

  it("shows disabled message on display tasks", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[]}>
        <ActionMenu
          task={{ ...taskWithTestSelection, displayOnly: true }}
          test={failingTest}
        />
      </MockedProvider>,
    );
    render(<Component />);
    await user.click(screen.getByDataCy("ellipsis-btn"));
    await waitFor(() => {
      expect(screen.getByDataCy("card-dropdown")).toBeVisible();
    });
    expect(
      screen.getByText(
        "Quarantine is not available on display tasks. Open one of this task's execution tasks to quarantine a test.",
      ),
    ).toBeVisible();
  });

  it("disables quarantine option when test is passing and not quarantined", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[]}>
        <ActionMenu task={taskWithTestSelection} test={passingTest} />
      </MockedProvider>,
    );
    render(<Component />);
    await user.click(screen.getByDataCy("ellipsis-btn"));
    await waitFor(() => {
      expect(screen.getByDataCy("quarantine-test")).toBeVisible();
    });
    expect(screen.getByDataCy("quarantine-test")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("quarantines a failing test", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={[quarantineTestMock]}>
        <ActionMenu task={taskWithTestSelection} test={failingTest} />
      </MockedProvider>,
    );
    render(<Component />);
    await user.click(screen.getByDataCy("ellipsis-btn"));
    await waitFor(() => {
      expect(screen.getByDataCy("quarantine-test")).toBeVisible();
    });
    await user.click(screen.getByDataCy("quarantine-test"));
    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledTimes(1);
    });
  });

  it("unquarantines a quarantined test", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={[unquarantineTestMock]}>
        <ActionMenu task={taskWithTestSelection} test={quarantinedTest} />
      </MockedProvider>,
    );
    render(<Component />);
    await user.click(screen.getByDataCy("ellipsis-btn"));
    await waitFor(() => {
      expect(screen.getByDataCy("unquarantine-test")).toBeVisible();
    });
    await user.click(screen.getByDataCy("unquarantine-test"));
    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledTimes(1);
    });
  });
});

const failingTest: TestResult = {
  id: "1",
  testFile: "test_1",
  status: TestStatus.Fail,
  isManuallyQuarantined: false,
  logs: {},
};

const passingTest: TestResult = {
  id: "2",
  testFile: "test_2",
  status: TestStatus.Pass,
  isManuallyQuarantined: false,
  logs: {},
};

const quarantinedTest: TestResult = {
  id: "3",
  testFile: "test_3",
  status: TestStatus.Pass,
  isManuallyQuarantined: true,
  logs: {},
};

const quarantineTestMock: ApolloMock<
  QuarantineTestMutation,
  QuarantineTestMutationVariables
> = {
  request: {
    query: QUARANTINE_TEST,
    variables: {
      taskId: taskQuery.task.id,
      testName: "test_1",
    },
  },
  result: {
    data: {
      quarantineTest: {
        __typename: "TestResult",
        id: "1",
        isManuallyQuarantined: true,
      },
    },
  },
};

const unquarantineTestMock: ApolloMock<
  UnquarantineTestMutation,
  UnquarantineTestMutationVariables
> = {
  request: {
    query: UNQUARANTINE_TEST,
    variables: {
      taskId: taskQuery.task.id,
      testName: "test_3",
    },
  },
  result: {
    data: {
      unquarantineTest: {
        __typename: "TestResult",
        id: "3",
        isManuallyQuarantined: false,
      },
    },
  },
};
