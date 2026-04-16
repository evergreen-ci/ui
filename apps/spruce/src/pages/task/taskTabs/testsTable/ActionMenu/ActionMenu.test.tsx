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

const task = { ...taskQuery.task, testSelectionEnabled: true };

describe("action menu for tests table", () => {
  it("shows disabled message when test selection is not enabled", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[]}>
        <ActionMenu
          task={{ ...task, testSelectionEnabled: false }}
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
      screen.getByText("Test selection is disabled for this task."),
    ).toBeVisible();
  });

  it("shows disabled message on display tasks", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[]}>
        <ActionMenu task={{ ...task, displayOnly: true }} test={failingTest} />
      </MockedProvider>,
    );
    render(<Component />);
    await user.click(screen.getByDataCy("ellipsis-btn"));
    await waitFor(() => {
      expect(screen.getByDataCy("card-dropdown")).toBeVisible();
    });
    expect(
      screen.getByText("Select an execution task to quarantine tests."),
    ).toBeVisible();
  });

  it("disables quarantine option when test is passing and not quarantined", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[]}>
        <ActionMenu task={task} test={passingTest} />
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
        <ActionMenu task={task} test={failingTest} />
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
        <ActionMenu task={task} test={quarantinedTest} />
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
        __typename: "QuarantineTestPayload",
        success: true,
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
        __typename: "UnquarantineTestPayload",
        success: true,
      },
    },
  },
};
