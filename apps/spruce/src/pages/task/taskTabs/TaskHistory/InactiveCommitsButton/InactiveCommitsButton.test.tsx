import {
  RenderFakeToastContext,
  renderWithRouterMatch,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { TaskQuery } from "gql/generated/types";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { taskQuery } from "gql/mocks/taskData";
import { MockedProvider } from "test_utils/graphql";
import { TaskHistoryContextProvider } from "../context";
import { tasks } from "../testData";
import InactiveCommitsButton from ".";

describe("InactiveCommitsButton component", () => {
  const currentTask: NonNullable<TaskQuery["task"]> = {
    ...taskQuery.task,
    id: tasks[0].id,
  };

  it("Clicking on button shows the inactive commits in order", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[getSpruceConfigMock]}>
        <TaskHistoryContextProvider
          baseTaskId=""
          isPatch={false}
          task={currentTask}
        >
          <InactiveCommitsButton inactiveTasks={tasks} />
        </TaskHistoryContextProvider>
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);
    expect(screen.getByText("11 Inactive Commits")).toBeInTheDocument();
    expect(screen.queryAllByDataCy("commit-details-card")).toHaveLength(0);
    const toggleButton = screen.getByRole("button");
    await user.click(toggleButton);
    expect(screen.getByText("11 Expanded")).toBeInTheDocument();
    const cards = screen.queryAllByDataCy("commit-details-card");
    for (let i = 0; i < cards.length; i++) {
      expect(cards[i]).toHaveTextContent(tasks[i].versionMetadata.message);
    }
  });
});
