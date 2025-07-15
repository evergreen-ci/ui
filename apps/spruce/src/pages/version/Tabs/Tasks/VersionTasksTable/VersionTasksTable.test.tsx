import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  within,
} from "@evg-ui/lib/test_utils";
import { SortDirection, TaskSortCategory } from "gql/generated/types";
import { VERSION_TASKS } from "gql/queries";
import { versionTasks } from "./testData";
import { VersionTasksTable, getInitialState } from ".";

const versionId = versionTasks.data.version.id;
const tasks = versionTasks.data.version.tasks.data;

const cache = new InMemoryCache({
  typePolicies: {
    Task: {
      fields: {
        reviewed: {
          read(existing) {
            return existing ?? false;
          },
        },
      },
    },
  },
});

cache.writeQuery({
  query: VERSION_TASKS,
  variables: { versionId },
  data: versionTasks.data,
});

describe("VersionTasksTable", () => {
  it("renders all rows", () => {
    render(
      <MockedProvider cache={cache}>
        <VersionTasksTable {...sharedProps} />
      </MockedProvider>,
    );
    expect(screen.queryAllByDataCy("tasks-table-row")).toHaveLength(4);
  });

  it("opens nested row on click", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider cache={cache}>
        <VersionTasksTable {...sharedProps} />
      </MockedProvider>,
    );
    expect(screen.queryByText("e2e_spruce_0")).toBeNull();
    const expandRowButton = within(
      screen.getAllByDataCy("tasks-table-row")[3],
    ).getByRole("button");
    await user.click(expandRowButton);
    expect(screen.queryByText("e2e_spruce_0")).toBeVisible();
  });

  it("calls clearQueryParams function when button is clicked", async () => {
    const user = userEvent.setup();
    const clearQueryParams = vi.fn();
    render(
      <MockedProvider cache={cache}>
        <VersionTasksTable
          {...sharedProps}
          clearQueryParams={clearQueryParams}
        />
      </MockedProvider>,
    );
    expect(screen.queryAllByDataCy("tasks-table-row")).toHaveLength(4);
    await user.click(screen.getByDataCy("clear-all-filters"));
    expect(clearQueryParams).toHaveBeenCalledTimes(1);
  });
});

const sharedProps = {
  clearQueryParams: () => {},
  filteredCount: tasks.length,
  isPatch: false,
  limit: 10,
  loading: false,
  page: 0,
  tasks,
  totalCount: tasks.length,
  versionId,
};

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
