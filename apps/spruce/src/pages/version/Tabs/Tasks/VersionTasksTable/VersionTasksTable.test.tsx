import { MockedProvider } from "@apollo/client/testing";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  within,
} from "@evg-ui/lib/test_utils";
import { SortDirection, TaskSortCategory } from "gql/generated/types";
import { tasks } from "./testData";
import { VersionTasksTable, getInitialState } from ".";

describe("VersionTasksTable", () => {
  it("renders all rows", () => {
    render(
      <MockedProvider>
        <VersionTasksTable
          clearQueryParams={() => {}}
          filteredCount={tasks.length}
          isPatch={false}
          limit={10}
          loading={false}
          page={0}
          tasks={tasks}
          totalCount={tasks.length}
        />
      </MockedProvider>,
    );
    expect(screen.queryAllByDataCy("tasks-table-row")).toHaveLength(4);
  });

  it("opens nested row on click", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider>
        <VersionTasksTable
          clearQueryParams={() => {}}
          filteredCount={tasks.length}
          isPatch={false}
          limit={10}
          loading={false}
          page={0}
          tasks={tasks}
          totalCount={tasks.length}
        />
      </MockedProvider>,
    );
    expect(screen.queryByText("Another execution task")).toBeNull();
    const expandRowButton = within(
      screen.getAllByDataCy("tasks-table-row")[3],
    ).getByRole("button");
    await user.click(expandRowButton);
    expect(screen.queryByText("Another execution task")).toBeVisible();
  });
});

describe("getInitialState", () => {
  it("should get the correct initialSort when passed in sorts key", () => {
    const { initialSorting } = getInitialState({
      sorts: `${TaskSortCategory.Variant}:${SortDirection.Asc};${TaskSortCategory.Status}:${SortDirection.Asc};${TaskSortCategory.Name}:${SortDirection.Desc}`,
    });
    expect(initialSorting).toEqual([
      {
        desc: false,
        id: TaskSortCategory.Variant,
      },
      {
        desc: false,
        id: TaskSortCategory.Status,
      },
      {
        desc: true,
        id: TaskSortCategory.Name,
      },
    ]);
  });
});
