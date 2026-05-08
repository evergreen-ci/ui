import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  within,
} from "@evg-ui/lib/test_utils";
import {
  SortDirection,
  TaskSortCategory,
  VersionTaskDurationsQuery,
} from "gql/generated/types";
import { PatchTasksQueryParams } from "types/task";
import TaskDurationTable, { getInitialParams } from ".";

describe("TaskDurationTable", () => {
  it("renders all rows", () => {
    render(
      <MockedProvider>
        <TaskDurationTable loading={false} numLoadingRows={10} tasks={tasks} />
      </MockedProvider>,
    );
    expect(screen.queryAllByDataCy("task-duration-table-row")).toHaveLength(2);
  });

  it("opens nested row on click", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider>
        <TaskDurationTable loading={false} numLoadingRows={10} tasks={tasks} />
      </MockedProvider>,
    );
    expect(screen.queryByText("check_codegen_execution_task")).toBeNull();
    const expandRowButton = within(
      screen.getAllByDataCy("task-duration-table-row")[0],
    ).getByRole("button");
    await user.click(expandRowButton);
    expect(screen.queryByText("check_codegen_execution_task")).toBeVisible();
  });
});

describe("getInitialParams", () => {
  it("should get the correct initialSort when passed in sorts key", () => {
    const { initialSort } = getInitialParams({
      sorts: `${TaskSortCategory.Duration}:${SortDirection.Desc};${TaskSortCategory.Variant}:${SortDirection.Asc};${TaskSortCategory.Status}:${SortDirection.Asc};${TaskSortCategory.Name}:${SortDirection.Desc}`,
    });
    expect(initialSort).toEqual([
      {
        desc: true,
        id: PatchTasksQueryParams.Duration,
      },
      {
        desc: false,
        id: PatchTasksQueryParams.Variant,
      },
      {
        desc: false,
        id: PatchTasksQueryParams.Statuses,
      },
      {
        desc: true,
        id: PatchTasksQueryParams.TaskName,
      },
    ]);
  });
});
const tasks: VersionTaskDurationsQuery["version"]["tasks"]["data"] = [
  {
    id: "spruce_ubuntu1604_check_codegen_patch_345da020487255d1b9fb87bed4ceb98397a0c5a5_624af28fa4cf4714c7a6c19a_22_04_04_13_28_48",
    execution: 0,
    displayStatus: "success",
    displayName: "check_codegen",
    buildVariantDisplayName: "Ubuntu 16.04",
    buildVariant: "ubuntu1604",
    timeTaken: 6000,
    subRows: [
      {
        id: "spruce_ubuntu1604_check_codegen_patch_345da020487255d1b9fb87bed4ceb98397a0c5a5_624af28fa4cf4714c7a6c19a_22_04_04_13_28_48",
        execution: 0,
        displayStatus: "success",
        displayName: "check_codegen_execution_task",
        buildVariantDisplayName: "Ubuntu 16.04",
        timeTaken: 4000,
      },
    ],
    __typename: "Task",
  },
  {
    id: "spruce_ubuntu1604_compile_patch_345da020487255d1b9fb87bed4ceb98397a0c5a5_624af28fa4cf4714c7a6c19a_22_04_04_13_28_48",
    execution: 0,
    displayStatus: "success",
    displayName: "compile",
    buildVariantDisplayName: "Ubuntu 16.04",
    buildVariant: "ubuntu1604",
    subRows: null,
    timeTaken: 10000,
    __typename: "Task",
  },
];
