import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
  within,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { TestStatus } from "@evg-ui/lib/types/test";
import {
  QuarantineTestMutation,
  QuarantineTestMutationVariables,
  TestResult,
  UnquarantineTestMutation,
  UnquarantineTestMutationVariables,
} from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { QUARANTINE_TEST, UNQUARANTINE_TEST } from "gql/mutations";
import { ActionMenu } from ".";

const taskWithTestSelection = {
  ...taskQuery.task,
  canQuarantine: true,
  testSelectionEnabled: true,
};

const taskRequiringJiraTickets = {
  ...taskWithTestSelection,
  project: {
    ...taskQuery.task.project!,
    testSelection: { allowed: true, quarantineJiraTicketsRequired: true },
  },
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
    await user.click(screen.getByTestId("ellipsis-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("card-dropdown")).toBeVisible();
    });
    expect(
      screen.getByText(
        "Test selection did not run for this task, so its tests cannot be quarantined.",
      ),
    ).toBeVisible();
  });

  it.each([
    ["an unquarantined", failingTest],
    ["a quarantined", quarantinedTest],
  ])(
    "shows disabled message for %s test when the user cannot quarantine tests",
    async (_, test) => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[]}>
          <ActionMenu
            task={{ ...taskWithTestSelection, canQuarantine: false }}
            test={test}
          />
        </MockedProvider>,
      );
      render(<Component />);
      await user.click(screen.getByTestId("ellipsis-btn"));
      await waitFor(() => {
        expect(screen.getByTestId("card-dropdown")).toBeVisible();
      });
      expect(
        screen.getByText(
          "You do not have permission to quarantine or unquarantine tests in this project. Request the Test quarantine permission in MANA.",
        ),
      ).toBeVisible();
      expect(screen.queryByTestId("quarantine-test")).not.toBeInTheDocument();
      expect(screen.queryByTestId("unquarantine-test")).not.toBeInTheDocument();
    },
  );

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
    await user.click(screen.getByTestId("ellipsis-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("quarantine-test")).toBeVisible();
    });
    await user.click(screen.getByTestId("quarantine-test"));
    await user.click(await screen.findByTestId("confirm-quarantine-test"));
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
    await user.click(screen.getByTestId("ellipsis-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("quarantine-test")).toBeVisible();
    });
    expect(screen.getByTestId("quarantine-test")).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.click(screen.getByTestId("quarantine-test"));
    await user.click(await screen.findByTestId("confirm-quarantine-test"));
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
    await user.click(screen.getByTestId("ellipsis-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("quarantine-test")).toBeVisible();
    });
    await user.click(screen.getByTestId("quarantine-test"));
    await user.click(await screen.findByTestId("confirm-quarantine-test"));
    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledTimes(1);
    });
  });

  it("allows quarantining without Jira tickets when the project does not require them", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[]}>
        <ActionMenu task={taskWithTestSelection} test={failingTest} />
      </MockedProvider>,
    );
    render(<Component />);
    await user.click(screen.getByTestId("ellipsis-btn"));
    await user.click(await screen.findByTestId("quarantine-test"));
    expect(
      await screen.findByTestId("quarantine-jira-tickets"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("confirm-quarantine-test")).not.toHaveAttribute(
      "disabled",
    );
  });

  it("requires a Jira ticket when the project requires them", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[]}>
        <ActionMenu task={taskRequiringJiraTickets} test={failingTest} />
      </MockedProvider>,
    );
    render(<Component />);
    await user.click(screen.getByTestId("ellipsis-btn"));
    await user.click(await screen.findByTestId("quarantine-test"));
    expect(
      await screen.findByTestId("confirm-quarantine-test"),
    ).toHaveAttribute("disabled");
  });

  it("sends multiple Jira tickets and the justification", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={[quarantineWithDetailsMock]}>
        <ActionMenu task={taskRequiringJiraTickets} test={failingTest} />
      </MockedProvider>,
    );
    render(<Component />);
    await user.click(screen.getByTestId("ellipsis-btn"));
    await user.click(await screen.findByTestId("quarantine-test"));
    await user.type(
      within(await screen.findByTestId("quarantine-jira-tickets")).getByRole(
        "textbox",
      ),
      "BF-123, EVG-456 BF-123",
    );
    await user.type(
      within(screen.getByTestId("quarantine-justification")).getByRole(
        "textbox",
      ),
      "Fails intermittently.",
    );
    await user.click(screen.getByTestId("confirm-quarantine-test"));
    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledTimes(1);
    });
  });

  it("disables quarantining when a Jira ticket is malformed", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[]}>
        <ActionMenu task={taskWithTestSelection} test={failingTest} />
      </MockedProvider>,
    );
    render(<Component />);
    await user.click(screen.getByTestId("ellipsis-btn"));
    await user.click(await screen.findByTestId("quarantine-test"));
    await user.type(
      within(await screen.findByTestId("quarantine-jira-tickets")).getByRole(
        "textbox",
      ),
      "BF-123, bf123",
    );
    expect(screen.getByTestId("confirm-quarantine-test")).toHaveAttribute(
      "disabled",
    );
    expect(
      screen.getByText("Not a valid Jira ticket key: bf123"),
    ).toBeInTheDocument();
  });

  it("unquarantines a quarantined test", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={[unquarantineTestMock]}>
        <ActionMenu task={taskWithTestSelection} test={quarantinedTest} />
      </MockedProvider>,
    );
    render(<Component />);
    await user.click(screen.getByTestId("ellipsis-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("unquarantine-test")).toBeVisible();
    });
    await user.click(screen.getByTestId("unquarantine-test"));
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
  existingJiraTicketsToLink,
  id,
  justification,
  taskId,
  testName,
}: {
  id: string;
  taskId: string;
  testName: string;
  existingJiraTicketsToLink?: string[];
  justification?: string;
}): ApolloMock<QuarantineTestMutation, QuarantineTestMutationVariables> => ({
  request: {
    query: QUARANTINE_TEST,
    variables: { taskId, testName, existingJiraTicketsToLink, justification },
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

const quarantineWithDetailsMock = quarantineMock({
  id: "1",
  taskId: taskQuery.task.id,
  testName: "test_1",
  existingJiraTicketsToLink: ["BF-123", "EVG-456"],
  justification: "Fails intermittently.",
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
