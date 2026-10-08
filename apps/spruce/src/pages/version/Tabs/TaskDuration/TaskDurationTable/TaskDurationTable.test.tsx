import { InMemoryCache } from "@apollo/client";
import {
  MockedProvider,
  renderWithRouterMatch,
  screen,
  userEvent,
  within,
} from "@evg-ui/lib/test_utils";
import { getTaskRoute } from "constants/routes";
import {
  SortDirection,
  TaskSortCategory,
  TaskStatusesQuery,
  VersionTaskDurationsQuery,
} from "gql/generated/types";
import { TASK_STATUSES } from "gql/queries";
import { PatchTasksQueryParams } from "types/task";
import TaskDurationTable, { getInitialParams } from ".";

vi.mock("analytics", () => ({
  useVersionAnalytics: () => ({ sendEvent: vi.fn() }),
}));

const cache = new InMemoryCache();
const statusData: TaskStatusesQuery = {
  version: {
    id: "version-1234",
    taskStatuses: ["success"],
    baseVersion: null,
  },
};
cache.writeQuery({
  query: TASK_STATUSES,
  variables: { id: "version-1234" },
  data: statusData,
});

const renderTable = (
  props: Partial<React.ComponentProps<typeof TaskDurationTable>> = {},
) =>
  renderWithRouterMatch(
    <TaskDurationTable
      isPatch
      loading={false}
      numLoadingRows={10}
      tasks={tasks}
      {...props}
    />,
    {
      route: "/version/version-1234/task-duration",
      path: "/version/:versionId/task-duration",
      wrapper: ({ children }) => (
        <MockedProvider cache={cache}>{children}</MockedProvider>
      ),
    },
  );

describe("TaskDurationTable", () => {
  it("renders all rows", () => {
    renderTable();
    expect(screen.queryAllByTestId("task-duration-table-row")).toHaveLength(2);
  });

  it("opens nested row on click", async () => {
    const user = userEvent.setup();
    renderTable();
    expect(screen.queryByText("check_codegen_execution_task")).toBeNull();
    const expandRowButton = within(
      screen.getAllByTestId("task-duration-table-row")[0],
    ).getByRole("button");
    await user.click(expandRowButton);
    expect(screen.queryByText("check_codegen_execution_task")).toBeVisible();
    expect(
      screen.getByRole("link", {
        name: "Base task duration for check_codegen_execution_task: 5s",
      }),
    ).toHaveAttribute(
      "href",
      getTaskRoute("base_execution_task", { execution: 1 }),
    );
  });

  it("shows linked base durations alongside current durations and an unavailable state", () => {
    renderTable();

    expect(
      screen.getByRole("columnheader", { name: "Base Task Duration" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Sort by Base Task Duration" }),
    ).not.toBeInTheDocument();
    const [taskWithBase, taskWithoutBase] = screen.getAllByTestId(
      "task-duration-table-row",
    );
    expect(within(taskWithBase).getByText("6s")).toBeVisible();
    expect(
      within(taskWithBase).getByRole("link", {
        name: "Base task duration for check_codegen: 8s",
      }),
    ).toHaveAttribute(
      "href",
      getTaskRoute("base_check_codegen", { execution: 2 }),
    );
    expect(within(taskWithoutBase).getByText("Unavailable")).toBeVisible();
    expect(within(taskWithoutBase).getByText("Unavailable")).toHaveAttribute(
      "title",
      "No matching task was found for this comparison.",
    );
  });

  it("labels the comparison as previous duration for commit builds", () => {
    renderTable({ isPatch: false });
    expect(
      screen.getByRole("columnheader", { name: "Previous Task Duration" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", {
        name: "Previous task duration for check_codegen: 8s",
      }),
    ).toBeVisible();
  });

  it("uses a neutral comparison label while the version is loading", () => {
    renderTable({ isPatch: undefined, loading: true, tasks: [] });
    expect(
      screen.getByRole("columnheader", { name: "Comparison Task Duration" }),
    ).toBeVisible();
    expect(screen.queryByText("Unavailable")).not.toBeInTheDocument();
  });

  it.each([null, undefined])(
    "renders an undispatched task without a recorded duration (%s) as zero",
    (timeTaken) => {
      const fixture: VersionTaskDurationsQuery["version"]["tasks"]["data"] = [
        { ...tasks[1], displayStatus: "unstarted", timeTaken },
      ];
      renderTable({ tasks: fixture });
      expect(screen.getByText("0s")).toBeVisible();
      expect(screen.getByText("0s")).toHaveAttribute("title", "0s");
    },
  );

  it("includes failed baseline status and the full duration in its link description", () => {
    const fixture: VersionTaskDurationsQuery["version"]["tasks"]["data"] = [
      {
        ...tasks[1],
        baseTask: {
          id: "base_failed_compile",
          displayStatus: "failed",
          execution: 1,
          finishTime: new Date("2022-04-04T12:00:00Z"),
          timeTaken: 3601500,
        },
      },
    ];
    renderTable({ tasks: fixture });
    const link = screen.getByRole("link", {
      name: "Base task duration for compile: 1h 0m",
    });
    expect(link).toHaveAttribute("title", "Failed, execution 2; 3601.5s");
    expect(link).toHaveTextContent("1h 0m");
  });

  it.each([
    { finishTime: null, timeTaken: 0, expectedDuration: "Unavailable" },
    { finishTime: null, timeTaken: 8000, expectedDuration: "Unavailable" },
    {
      finishTime: new Date("2022-04-04T12:00:00Z"),
      timeTaken: null,
      expectedDuration: "Unavailable",
    },
    {
      finishTime: new Date("2022-04-04T12:00:00Z"),
      timeTaken: 0,
      expectedDuration: "0s",
    },
  ])(
    "shows $expectedDuration for a baseline with finishTime $finishTime and duration $timeTaken",
    ({ expectedDuration, finishTime, timeTaken }) => {
      const fixture: VersionTaskDurationsQuery["version"]["tasks"]["data"] = [
        {
          ...tasks[1],
          baseTask: {
            id: "base_compile",
            displayStatus: "success",
            execution: 0,
            finishTime,
            timeTaken,
          },
        },
      ];
      renderTable({ tasks: fixture });
      const row = screen.getByTestId("task-duration-table-row");
      expect(within(row).getByText(expectedDuration)).toBeVisible();
      if (expectedDuration === "0s") {
        expect(
          within(row).getByRole("link", {
            name: "Base task duration for compile: 0s",
          }),
        ).toHaveAttribute(
          "href",
          getTaskRoute("base_compile", { execution: 0 }),
        );
      } else {
        expect(
          within(row).queryByRole("link", { name: /Base task duration/ }),
        ).toBeNull();
        expect(within(row).getByText("Unavailable")).toHaveAttribute(
          "title",
          finishTime
            ? "The comparison task has no recorded duration."
            : "The comparison task has not finished.",
        );
      }
    },
  );
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
    baseTask: {
      id: "base_check_codegen",
      displayStatus: "success",
      execution: 2,
      finishTime: new Date("2022-04-04T12:00:00Z"),
      timeTaken: 8000,
    },
    subRows: [
      {
        id: "spruce_ubuntu1604_check_codegen_patch_345da020487255d1b9fb87bed4ceb98397a0c5a5_624af28fa4cf4714c7a6c19a_22_04_04_13_28_48",
        execution: 0,
        displayStatus: "success",
        displayName: "check_codegen_execution_task",
        buildVariantDisplayName: "Ubuntu 16.04",
        timeTaken: 4000,
        baseTask: {
          id: "base_execution_task",
          displayStatus: "success",
          execution: 1,
          finishTime: new Date("2022-04-04T12:00:00Z"),
          timeTaken: 5000,
        },
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
    baseTask: null,
    __typename: "Task",
  },
];
