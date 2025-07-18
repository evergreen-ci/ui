import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { getTestUtils } from "@leafygreen-ui/checkbox";
import { getTestUtils as getTableUtils } from "@leafygreen-ui/table";
import {
  fireEvent,
  waitFor,
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

  describe("marking tasks as reviewed", () => {
    it("allows checking a task", async () => {
      render(
        <MockedProvider cache={cache}>
          <VersionTasksTable {...sharedProps} />
        </MockedProvider>,
      );
      expect(screen.queryAllByLabelText("Mark as reviewed")).toHaveLength(4);

      const { getInput, getInputValue, isDisabled } = getTestUtils(
        `lg-reviewed-${tasks[0].id}`,
      );
      expect(isDisabled()).toBe(false);
      expect(getInputValue()).toBe(false);

      // Use fireEvent because this checkbox has no label to click.
      // This is how LG tests their checkboxes ¯\_(ツ)_/¯
      fireEvent.click(getInput());
      await waitFor(() => {
        expect(getInputValue()).toBe(true);
      });

      fireEvent.click(getInput());
      await waitFor(() => {
        expect(getInputValue()).toBe(false);
      });
    });

    it("disables the checkbox for successful tasks", async () => {
      render(
        <MockedProvider cache={cache}>
          <VersionTasksTable {...sharedProps} />
        </MockedProvider>,
      );

      expect(getTestUtils(`lg-reviewed-${tasks[1].id}`).isDisabled()).toBe(
        true,
      );
    });

    it("checking a display task marks unsuccessful children", async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider cache={cache}>
          <VersionTasksTable {...sharedProps} />
        </MockedProvider>,
      );
      expect(screen.queryAllByLabelText("Mark as reviewed")).toHaveLength(4);

      let displayTask = getTestUtils(`lg-reviewed-${tasks[3].id}`);
      expect(displayTask.isDisabled()).toBe(false);
      expect(displayTask.getInputValue()).toBe(false);

      // Use fireEvent because this checkbox has no label to click.
      // This is how LG tests their checkboxes ¯\_(ツ)_/¯
      fireEvent.click(displayTask.getInput());

      const { getRowByIndex } = getTableUtils();
      // @ts-expect-error This does exist, incorrect typing from LeafyGreen
      const { getExpandButton } = getRowByIndex(3);
      await user.click(getExpandButton());

      expect(displayTask.getInputValue()).toBe(true);

      const executionTask0 = getTestUtils(
        `lg-reviewed-${tasks[3]?.executionTasksFull?.[0]?.id}`,
      );
      const executionTask1 = getTestUtils(
        `lg-reviewed-${tasks[3]?.executionTasksFull?.[1]?.id}`,
      );
      const executionTask2 = getTestUtils(
        `lg-reviewed-${tasks[3]?.executionTasksFull?.[2]?.id}`,
      );
      const executionTask3 = getTestUtils(
        `lg-reviewed-${tasks[3]?.executionTasksFull?.[3]?.id}`,
      );
      expect(executionTask0.getInputValue()).toBe(true);
      expect(executionTask1.getInputValue()).toBe(true);
      expect(executionTask2.getInputValue()).toBe(true);
      expect(executionTask3.getInputValue()).toBe(false);

      fireEvent.click(executionTask0.getInput());
      await waitFor(() => {
        expect(executionTask0.getInputValue()).toBe(false);
      });

      displayTask = getTestUtils(`lg-reviewed-${tasks[3].id}`);
      expect(displayTask.isIndeterminate()).toBe(true);
      expect(displayTask.getInputValue()).toBe(false);

      fireEvent.click(executionTask1.getInput());
      fireEvent.click(executionTask2.getInput());
      await waitFor(() => {
        expect(displayTask.isIndeterminate()).toBe(false);
      });
    });
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
