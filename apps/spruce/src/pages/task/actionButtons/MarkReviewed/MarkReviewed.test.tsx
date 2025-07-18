import { gql, InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskQuery } from "gql/generated/types";
import { TASK } from "gql/queries";
import { taskData, displayTaskData } from "./taskData";
import { MarkReviewed } from ".";

const cache = new InMemoryCache({
  typePolicies: {
    Task: {
      keyFields: ["execution", "id"],
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

const taskId = taskData.id;
const displayTaskId = displayTaskData.id;

cache.writeQuery({
  query: TASK,
  variables: {
    taskId: taskId,
  },
  data: { task: taskData },
});

cache.writeQuery({
  query: TASK,
  variables: {
    taskId: displayTaskId,
  },
  data: { task: displayTaskData },
});

const read = (task: NonNullable<TaskQuery["task"]>) =>
  cache.readFragment({
    id: cache.identify(task),
    fragment: gql`
      fragment ReviewedTask on Task {
        id
        displayStatus
        execution
        executionTasksFull {
          id
          displayStatus
          execution
          reviewed
        }
        reviewed
      }
    `,
  }) as NonNullable<TaskQuery["task"]>;

describe("mark as reviewed button", () => {
  it("the button causes an update to the cache and rerenders accordingly", async () => {
    const user = userEvent.setup();
    const query = read(taskData);
    const { rerender } = render(
      <MockedProvider cache={cache}>
        <MarkReviewed task={query} />
      </MockedProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Mark reviewed");
    await user.click(screen.getByRole("button"));

    // Since this component does not read directly from the query itself, manually refresh the data passed in as a prop
    const refreshedQuery = read(taskData);
    rerender(
      <MockedProvider cache={cache}>
        <MarkReviewed task={refreshedQuery} />
      </MockedProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Mark unreviewed");

    await user.click(screen.getByRole("button"));
    const secondRefreshedQuery = read(taskData);
    rerender(
      <MockedProvider cache={cache}>
        <MarkReviewed task={secondRefreshedQuery} />
      </MockedProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Mark reviewed");
  });

  it("on a display task, the button updates all of its execution tasks", async () => {
    const user = userEvent.setup();
    const query = read(displayTaskData);
    const { rerender } = render(
      <MockedProvider cache={cache}>
        <MarkReviewed task={query} />
      </MockedProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Mark reviewed");

    await user.click(screen.getByRole("button"));
    const refreshedQuery = read(displayTaskData);
    rerender(
      <MockedProvider cache={cache}>
        <MarkReviewed task={refreshedQuery} />
      </MockedProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Mark unreviewed");
    expect(
      refreshedQuery?.executionTasksFull?.every(
        (t) => t.reviewed || t.displayStatus === TaskStatus.Succeeded,
      ),
    ).toBe(true);

    await user.click(screen.getByRole("button"));
    const secondRefreshedQuery = read(displayTaskData);
    rerender(
      <MockedProvider cache={cache}>
        <MarkReviewed task={secondRefreshedQuery} />
      </MockedProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Mark reviewed");
    expect(
      secondRefreshedQuery?.executionTasksFull?.every(
        ({ reviewed }) => reviewed === false,
      ),
    ).toBe(true);
  });

  it("on an execution task, the button updates the task and its display task", async () => {
    const user = userEvent.setup();
    const query = read(displayTaskData);
    const { rerender } = render(
      <MockedProvider cache={cache}>
        <MarkReviewed
          task={query.executionTasksFull?.[0] as NonNullable<TaskQuery["task"]>}
        />
      </MockedProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Mark reviewed");

    await user.click(screen.getByRole("button"));
    const refreshedQuery = read(displayTaskData);
    rerender(
      <MockedProvider cache={cache}>
        <MarkReviewed
          task={
            refreshedQuery.executionTasksFull?.[0] as NonNullable<
              TaskQuery["task"]
            >
          }
        />
      </MockedProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Mark unreviewed");
    expect(refreshedQuery?.executionTasksFull?.[0].reviewed).toBe(true);
    expect(refreshedQuery.reviewed).toBe(false);

    await user.click(screen.getByRole("button"));
    const secondRefreshedQuery = read(displayTaskData);
    rerender(
      <MockedProvider cache={cache}>
        <MarkReviewed
          task={
            secondRefreshedQuery.executionTasksFull?.[0] as NonNullable<
              TaskQuery["task"]
            >
          }
        />
      </MockedProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Mark reviewed");
    expect(secondRefreshedQuery?.executionTasksFull?.[0].reviewed).toBe(false);
    expect(secondRefreshedQuery.reviewed).toBe(false);
  });

  it("disables button for a successful task", () => {
    const query = read(displayTaskData);
    render(
      <MockedProvider cache={cache}>
        <MarkReviewed
          task={query.executionTasksFull?.[3] as NonNullable<TaskQuery["task"]>}
        />
      </MockedProvider>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-disabled", "true");
  });
});
