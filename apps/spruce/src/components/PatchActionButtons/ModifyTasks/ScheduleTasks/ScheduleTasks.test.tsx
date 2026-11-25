import { Button, Menu, MenuPopover, MenuRoot } from "@via-ds/components";
import { GraphQLError } from "graphql";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  ScheduleTasksByFilterMutation,
  ScheduleTasksByFilterMutationVariables,
  ScheduleTasksByIdsMutation,
  ScheduleTasksByIdsMutationVariables,
} from "gql/generated/types";
import { SCHEDULE_TASKS_BY_FILTER, SCHEDULE_TASKS_BY_IDS } from "gql/mutations";
import { SelectedMode, SelectionState } from "pages/version/TaskSelection";
import { ScheduleTasks } from ".";

const versionId = "version";

const makeTask = (id: string) => ({
  id,
  buildVariant: "ubuntu",
  buildVariantDisplayName: "Ubuntu",
  canSchedule: false,
  canUnschedule: true,
  displayName: id,
  displayStatus: "will-run",
  execution: 0,
  revision: "abc123",
  status: "will-run",
});

const scheduleTasksByIdsMock = (
  taskIds: string[],
  result: ScheduleTasksByIdsMutation["scheduleTasksByIds"],
): ApolloMock<
  ScheduleTasksByIdsMutation,
  ScheduleTasksByIdsMutationVariables
> => ({
  request: { query: SCHEDULE_TASKS_BY_IDS, variables: { taskIds } },
  result: { data: { scheduleTasksByIds: result } },
});

const scheduleTasksByFilterMock = (
  variables: ScheduleTasksByFilterMutationVariables,
  result: ScheduleTasksByFilterMutation["scheduleTasksByFilter"],
): ApolloMock<
  ScheduleTasksByFilterMutation,
  ScheduleTasksByFilterMutationVariables
> => ({
  request: { query: SCHEDULE_TASKS_BY_FILTER, variables },
  result: { data: { scheduleTasksByFilter: result } },
});

interface RenderOptions {
  mocks?: ApolloMock<unknown, unknown>[];
  taskSelection: SelectionState | null;
}

const renderScheduleTasks = ({ mocks = [], taskSelection }: RenderOptions) => {
  const clearSelection = vi.fn();
  const { Component, dispatchToast } = RenderFakeToastContext(
    <MockedProvider mocks={mocks}>
      <MenuRoot>
        <Button>Open</Button>
        <MenuPopover>
          <Menu aria-label="Modify tasks">
            <ScheduleTasks
              clearSelection={clearSelection}
              taskSelection={taskSelection}
              versionId={versionId}
            />
          </Menu>
        </MenuPopover>
      </MenuRoot>
    </MockedProvider>,
  );
  render(<Component />);
  return { clearSelection, dispatchToast };
};

describe("scheduleTasks", () => {
  it("does nothing when there is no selection", async () => {
    const user = userEvent.setup();
    const { clearSelection, dispatchToast } = renderScheduleTasks({
      taskSelection: null,
    });

    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByTestId("schedule-selected-tasks"));

    expect(clearSelection).not.toHaveBeenCalled();
    expect(dispatchToast.success).not.toHaveBeenCalled();
    expect(dispatchToast.warning).not.toHaveBeenCalled();
    expect(dispatchToast.error).not.toHaveBeenCalled();
  });

  describe("when tasks are selected individually", () => {
    const taskSelection: SelectionState = {
      mode: SelectedMode.Include,
      taskIds: new Set(["task-1", "task-2"]),
    };

    it("schedules the selected tasks and clears the selection", async () => {
      const user = userEvent.setup();
      const { clearSelection, dispatchToast } = renderScheduleTasks({
        mocks: [
          scheduleTasksByIdsMock(["task-1", "task-2"], {
            modifiedTasks: [makeTask("task-1"), makeTask("task-2")],
            taskErrors: [],
          }),
        ],
        taskSelection,
      });

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.click(screen.getByTestId("schedule-selected-tasks"));

      expect(clearSelection).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(dispatchToast.success).toHaveBeenCalledWith("Scheduled 2 tasks");
      });
      expect(dispatchToast.warning).not.toHaveBeenCalled();
    });

    it("warns about tasks that could not be scheduled", async () => {
      const user = userEvent.setup();
      const { dispatchToast } = renderScheduleTasks({
        mocks: [
          scheduleTasksByIdsMock(["task-1", "task-2"], {
            modifiedTasks: [makeTask("task-1")],
            taskErrors: [{ taskId: "task-2", reason: "already scheduled" }],
          }),
        ],
        taskSelection,
      });

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.click(screen.getByTestId("schedule-selected-tasks"));

      await waitFor(() => {
        expect(dispatchToast.warning).toHaveBeenCalledWith(
          "Unable to schedule 1 task",
        );
      });
      expect(dispatchToast.success).toHaveBeenCalledWith("Scheduled 1 task");
    });

    it("shows an error toast when the mutation fails", async () => {
      const user = userEvent.setup();
      const { dispatchToast } = renderScheduleTasks({
        mocks: [
          {
            request: {
              query: SCHEDULE_TASKS_BY_IDS,
              variables: { taskIds: ["task-1", "task-2"] },
            },
            result: { errors: [new GraphQLError("something went wrong")] },
          },
        ],
        taskSelection,
      });

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.click(screen.getByTestId("schedule-selected-tasks"));

      await waitFor(() => {
        expect(dispatchToast.error).toHaveBeenCalledWith(
          "Unable to schedule tasks: something went wrong",
        );
      });
      expect(dispatchToast.success).not.toHaveBeenCalled();
    });
  });

  describe("when all matching tasks are selected", () => {
    const taskSelection: SelectionState = {
      mode: SelectedMode.All,
      excludedIds: new Set(["task-3"]),
      filter: { statuses: ["failed"], variant: "ubuntu" },
      totalCount: 10,
    };
    it("schedules by filter, excluding deselected tasks, and clears the selection", async () => {
      const user = userEvent.setup();
      const { clearSelection, dispatchToast } = renderScheduleTasks({
        mocks: [
          scheduleTasksByFilterMock(
            {
              versionId,
              filter: {
                excludeTaskIds: ["task-3"],
                statuses: ["failed"],
                variant: "ubuntu",
              },
            },
            {
              modifiedTasks: [makeTask("task-1"), makeTask("task-2")],
              taskErrors: [],
            },
          ),
        ],
        taskSelection,
      });

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.click(screen.getByTestId("schedule-selected-tasks"));

      expect(clearSelection).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(dispatchToast.success).toHaveBeenCalledWith("Scheduled 2 tasks");
      });
    });
  });
});
