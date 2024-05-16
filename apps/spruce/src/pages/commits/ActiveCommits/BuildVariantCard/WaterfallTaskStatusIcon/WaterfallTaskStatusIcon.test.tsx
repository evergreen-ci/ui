import { MockedProvider } from "@apollo/client/testing";
import {
  FailedTaskStatusIconTooltipQuery,
  FailedTaskStatusIconTooltipQueryVariables,
} from "gql/generated/types";
import { FAILED_TASK_STATUS_ICON_TOOLTIP } from "gql/queries";
import {
  injectGlobalHighlightStyle,
  removeGlobalHighlightStyle,
} from "pages/commits/ActiveCommits/utils";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { ApolloMock } from "types/gql";
import { WaterfallTaskStatusIcon } from ".";

const props = {
  displayName: "multiversion",
  timeTaken: 2754729,
  taskId: "task",
  identifier: "ubuntu1604-multiversion",
};

jest.mock("../../utils");

const Content = ({
  hasCedarResults = false,
  status,
}: {
  status: string;
  hasCedarResults: boolean;
}) => (
  <MockedProvider mocks={[getTooltipQueryMock]}>
    <WaterfallTaskStatusIcon
      {...props}
      status={status}
      hasCedarResults={hasCedarResults}
    />
  </MockedProvider>
);
describe("waterfallTaskStatusIcon", () => {
  it("tooltip should contain task name, duration, list of failing test names and additonal test count", async () => {
    const user = userEvent.setup();
    render(<Content status="failed" hasCedarResults />);
    // @ts-ignore: FIXME. This comment was added by an automated script.
    await user.hover(screen.queryByDataCy("waterfall-task-status-icon"));
    await waitFor(() => {
      expect(
        screen.queryByDataCy("waterfall-task-status-icon-tooltip"),
      ).toBeVisible();
    });
    await waitFor(() => {
      expect(screen.queryByText("multiversion - 45m 54s")).toBeVisible();
    });
    await waitFor(() => {
      expect(
        screen.queryByText(
          "jstests/multiVersion/remove_invalid_index_options.js",
        ),
      ).toBeVisible();
    });
    await waitFor(() => {
      expect(screen.queryByText("and 2 more")).toBeVisible();
    });
  });

  it("icon should link to task page", async () => {
    render(<Content status="failed" hasCedarResults />);
    await waitFor(() => {
      expect(
        screen.getByDataCy("waterfall-task-status-icon"),
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.queryByDataCy("waterfall-task-status-icon"),
      ).toHaveAttribute("href", "/task/task");
    });
  });

  it("should call the appropriate functions on hover and unhover", async () => {
    const user = userEvent.setup();
    (injectGlobalHighlightStyle as jest.Mock).mockImplementationOnce(
      (taskIdentifier: string) => {
        Promise.resolve(taskIdentifier);
      },
    );
    (removeGlobalHighlightStyle as jest.Mock).mockImplementationOnce(() => {});

    render(<Content status="failed" hasCedarResults />);
    // @ts-ignore: FIXME. This comment was added by an automated script.
    await user.hover(screen.queryByDataCy("waterfall-task-status-icon"));
    await waitFor(() => {
      expect(injectGlobalHighlightStyle).toHaveBeenCalledTimes(1);
    });
    expect(injectGlobalHighlightStyle).toHaveBeenCalledWith(props.identifier);

    // @ts-ignore: FIXME. This comment was added by an automated script.
    await user.unhover(screen.queryByDataCy("waterfall-task-status-icon"));
    expect(removeGlobalHighlightStyle).toHaveBeenCalledTimes(1);
  });
});

const getTooltipQueryMock: ApolloMock<
  FailedTaskStatusIconTooltipQuery,
  FailedTaskStatusIconTooltipQueryVariables
> = {
  request: {
    query: FAILED_TASK_STATUS_ICON_TOOLTIP,
    variables: { taskId: "task" },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: "task",
        execution: 0,
        tests: {
          __typename: "TaskTestResult",
          filteredTestCount: 3,
          testResults: [
            {
              __typename: "TestResult",
              id: "83ca0a6b4c73f32e53f3dcbbe727842c",
              testFile: "jstests/multiVersion/remove_invalid_index_options.js",
            },
          ],
        },
      },
    },
  },
};
