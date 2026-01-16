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
  TestResult,
} from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { QUARANTINE_TEST } from "gql/mutations";
import { ActionMenu } from ".";

describe("action menu for tests table", () => {
  it("can open menu", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[quarantineTestMock]}>
        <ActionMenu task={taskQuery.task} test={failingTest} />
      </MockedProvider>,
    );
    render(<Component />);
    await user.click(screen.getByDataCy("ellipsis-btn"));
    await waitFor(() => {
      expect(screen.getByDataCy("card-dropdown")).toBeVisible();
    });
  });

  it("cannot quarantine if test is passing'", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[quarantineTestMock]}>
        <ActionMenu task={taskQuery.task} test={passingTest} />
      </MockedProvider>,
    );
    render(<Component />);
    await user.click(screen.getByDataCy("ellipsis-btn"));
    await waitFor(() => {
      expect(screen.getByDataCy("card-dropdown")).toBeVisible();
    });
    expect(screen.getByDataCy("quarantine-test")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("can quarantine if test is failing", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={[quarantineTestMock]}>
        <ActionMenu task={taskQuery.task} test={failingTest} />
      </MockedProvider>,
    );
    render(<Component />);
    await user.click(screen.getByDataCy("ellipsis-btn"));
    await waitFor(() => {
      expect(screen.getByDataCy("card-dropdown")).toBeVisible();
    });
    expect(screen.getByDataCy("quarantine-test")).toHaveAttribute(
      "aria-disabled",
      "false",
    );
    await user.click(screen.getByDataCy("quarantine-test"));
    expect(dispatchToast.success).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByDataCy("card-dropdown")).not.toBeInTheDocument();
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
