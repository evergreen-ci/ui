import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { TaskStatus } from "@evg-ui/lib/types/task";
import * as db from "components/TaskReview/db";
import { REVIEWED_TASK_FRAGMENT } from "components/TaskReview/utils";
import { TaskQuery } from "gql/generated/types";
import { TASK } from "gql/queries";
import { taskData, displayTaskData } from "./taskData";
import { MarkReviewed } from ".";

vi.spyOn(db, "setItem");
vi.spyOn(db, "setItems");

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
    fragment: REVIEWED_TASK_FRAGMENT,
  }) as NonNullable<TaskQuery["task"]>;

describe("mark as reviewed button", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("the button causes an update to the cache and rerenders accordingly", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider cache={cache}>
        <MarkReviewed execution={taskData.execution} taskId={taskData.id} />
      </MockedProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Mark reviewed");
    expect(db.setItem).toHaveBeenCalledTimes(0);
    await user.click(screen.getByRole("button"));

    expect(screen.getByRole("button")).toHaveTextContent("Mark unreviewed");
    expect(db.setItem).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("Mark reviewed");
    expect(db.setItem).toHaveBeenCalledTimes(2);
  });

  it("on a display task, the button updates all of its execution tasks", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider cache={cache}>
        <MarkReviewed
          execution={displayTaskData.execution}
          taskId={displayTaskData.id}
        />
      </MockedProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Mark reviewed");
    expect(db.setItem).toHaveBeenCalledTimes(0);

    await user.click(screen.getByRole("button"));
    const refreshedQuery = read(displayTaskData);
    expect(screen.getByRole("button")).toHaveTextContent("Mark unreviewed");
    expect(
      refreshedQuery?.executionTasksFull?.every(
        (t) => t.reviewed || t.displayStatus === TaskStatus.Succeeded,
      ),
    ).toBe(true);
    expect(db.setItem).toHaveBeenCalledTimes(0);
    expect(db.setItems).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button"));
    const secondRefreshedQuery = read(displayTaskData);
    expect(screen.getByRole("button")).toHaveTextContent("Mark reviewed");
    expect(
      secondRefreshedQuery?.executionTasksFull?.every(
        ({ reviewed }) => reviewed === false,
      ),
    ).toBe(true);
    expect(db.setItem).toHaveBeenCalledTimes(0);
    expect(db.setItems).toHaveBeenCalledTimes(2);
  });

  it("on an execution task, the button updates the task and its display tasks", async () => {
    const user = userEvent.setup();
    const executionTask = displayTaskData
      ?.executionTasksFull?.[0] as NonNullable<TaskQuery["task"]>;
    render(
      <MockedProvider cache={cache}>
        <MarkReviewed
          execution={executionTask.execution}
          taskId={executionTask.id}
        />
      </MockedProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Mark reviewed");

    await user.click(screen.getByRole("button"));
    const refreshedQuery = read(displayTaskData);
    expect(screen.getByRole("button")).toHaveTextContent("Mark unreviewed");
    expect(refreshedQuery?.executionTasksFull?.[0].reviewed).toBe(true);
    expect(refreshedQuery.reviewed).toBe(false);

    await user.click(screen.getByRole("button"));
    const secondRefreshedQuery = read(displayTaskData);
    expect(screen.getByRole("button")).toHaveTextContent("Mark reviewed");
    expect(secondRefreshedQuery?.executionTasksFull?.[0].reviewed).toBe(false);
    expect(secondRefreshedQuery.reviewed).toBe(false);
  });

  it("disables button for a successful task", () => {
    const executionTask = displayTaskData
      ?.executionTasksFull?.[3] as NonNullable<TaskQuery["task"]>;
    render(
      <MockedProvider cache={cache}>
        <MarkReviewed
          execution={executionTask.execution}
          taskId={executionTask.id}
        />
      </MockedProvider>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-disabled", "true");
  });

  it("updates parent state when all children are marked as reviewed", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider cache={cache}>
        <div>
          {displayTaskData?.executionTasksFull?.map(({ execution, id }) => (
            <MarkReviewed key={id} execution={execution} taskId={id} />
          ))}
          <MarkReviewed
            execution={displayTaskData.execution}
            taskId={displayTaskData.id}
          />
        </div>
      </MockedProvider>,
    );
    expect(db.setItem).toHaveBeenCalledTimes(0);

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);
    await user.click(buttons[1]);
    await user.click(buttons[2]);
    expect(buttons[3]).toHaveAttribute("aria-disabled", "true");
    expect(db.setItem).toHaveBeenCalledTimes(4);
    expect(db.setItem).toHaveBeenCalledWith(
      [displayTaskData.id, displayTaskData.execution],
      true,
    );

    expect(screen.getAllByRole("button")[0]).toHaveTextContent(
      "Mark unreviewed",
    );
    expect(screen.getAllByRole("button")[1]).toHaveTextContent(
      "Mark unreviewed",
    );
    expect(screen.getAllByRole("button")[2]).toHaveTextContent(
      "Mark unreviewed",
    );
    // Successful task does not have its state updated
    expect(screen.getAllByRole("button")[3]).toHaveTextContent("Mark reviewed");
    expect(screen.getAllByRole("button")[4]).toHaveTextContent(
      "Mark unreviewed",
    );
  });
});
