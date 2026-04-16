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
  QuarantineStatusQuery,
  QuarantineStatusQueryVariables,
  TestResult,
} from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { QUARANTINE_TEST, UNQUARANTINE_TEST } from "gql/mutations";
import { QUARANTINE_STATUS } from "gql/queries";
import { ActionMenu } from ".";

describe("action menu for tests table", () => {
  it("can open menu and shows loading state", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[notQuarantinedStatusMock]}>
        <ActionMenu task={taskQuery.task} test={failingTest} />
      </MockedProvider>,
    );
    render(<Component />);
    await user.click(screen.getByDataCy("ellipsis-btn"));
    await waitFor(() => {
      expect(screen.getByDataCy("card-dropdown")).toBeVisible();
    });
  });

  it("shows quarantine option when test is not quarantined", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={[notQuarantinedStatusMock, quarantineTestMock]}>
        <ActionMenu task={taskQuery.task} test={failingTest} />
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

  it("shows unquarantine option when test is quarantined", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={[quarantinedStatusMock, unquarantineTestMock]}>
        <ActionMenu task={taskQuery.task} test={passingTest} />
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
  logs: {},
};

const passingTest: TestResult = {
  id: "2",
  testFile: "test_2",
  status: TestStatus.Pass,
  logs: {},
};

const notQuarantinedStatusMock: ApolloMock<
  QuarantineStatusQuery,
  QuarantineStatusQueryVariables
> = {
  request: {
    query: QUARANTINE_STATUS,
    variables: {
      taskId: taskQuery.task.id,
      testName: "test_1",
    },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: taskQuery.task.id,
        quarantineStatus: {
          __typename: "QuarantineStatus",
          isQuarantined: false,
        },
      },
    },
  },
};

const quarantinedStatusMock: ApolloMock<
  QuarantineStatusQuery,
  QuarantineStatusQueryVariables
> = {
  request: {
    query: QUARANTINE_STATUS,
    variables: {
      taskId: taskQuery.task.id,
      testName: "test_2",
    },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: taskQuery.task.id,
        quarantineStatus: {
          __typename: "QuarantineStatus",
          isQuarantined: true,
        },
      },
    },
  },
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
      testName: "test_2",
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
