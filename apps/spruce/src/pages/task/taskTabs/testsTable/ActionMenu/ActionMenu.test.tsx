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
        "Test selection did not run for this task, so its tests cannot be quarantined.",
      ),
    ).toBeVisible();
  });

  it("quarantines a failing test on a display task using its execution task ID", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={[quarantineDisplayTaskTestMock]}>
        <ActionMenu
          task={{ ...taskWithTestSelection, displayOnly: true }}
          test={failingTestOnDisplayTask}
        />
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

  it("quarantines a passing test", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={[quarantinePassingTestMock]}>
        <ActionMenu task={taskWithTestSelection} test={passingTest} />
      </MockedProvider>,
    );
    render(<Component />);
    await user.click(screen.getByDataCy("ellipsis-btn"));
    await waitFor(() => {
      expect(screen.getByDataCy("quarantine-test")).toBeVisible();
    });
    expect(screen.getByDataCy("quarantine-test")).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.click(screen.getByDataCy("quarantine-test"));
    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledTimes(1);
    });
  });

  it("quarantines a failing test on a non-display task", async () => {
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
  taskId: taskQuery.task.id,
  testFile: "test_1",
  status: TestStatus.Fail,
  isManuallyQuarantined: false,
  logs: {},
};

const passingTest: TestResult = {
  id: "2",
  taskId: taskQuery.task.id,
  testFile: "test_2",
  status: TestStatus.Pass,
  isManuallyQuarantined: false,
  logs: {},
};

const quarantinedTest: TestResult = {
  id: "3",
  taskId: taskQuery.task.id,
  testFile: "test_3",
  status: TestStatus.Pass,
  isManuallyQuarantined: true,
  logs: {},
};

const failingTestOnDisplayTask: TestResult = {
  id: "4",
  taskId: "execTaskId",
  testFile: "test_4",
  status: TestStatus.Fail,
  isManuallyQuarantined: false,
  logs: {},
};

const quarantineMock = ({
  id,
  taskId,
  testName,
}: {
  id: string;
  taskId: string;
  testName: string;
}): ApolloMock<QuarantineTestMutation, QuarantineTestMutationVariables> => ({
  request: {
    query: QUARANTINE_TEST,
    variables: { taskId, testName },
  },
  result: {
    data: {
      quarantineTest: {
        __typename: "TestResult",
        id,
        isManuallyQuarantined: true,
      },
    },
  },
});

const quarantineTestMock = quarantineMock({
  id: "1",
  taskId: taskQuery.task.id,
  testName: "test_1",
});

const quarantinePassingTestMock = quarantineMock({
  id: "2",
  taskId: taskQuery.task.id,
  testName: "test_2",
});

const quarantineDisplayTaskTestMock = quarantineMock({
  id: "4",
  taskId: "execTaskId",
  testName: "test_4",
});

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
