import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch,
  screen,
  userEvent,
} from "@evg-ui/lib/src/test_utils";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { MockedProvider } from "test_utils/graphql";
import { tasks } from "../testData";
import CommitDetailsCard from ".";

describe("CommitDetailsCard component", () => {
  it("shows 'Restart Task' button if task is activated", () => {
    const currentTask = {
      ...tasks[5],
      activated: true,
      canRestart: true,
    };
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[getSpruceConfigMock]}>
        <CommitDetailsCard
          isCurrentTask={false}
          isMatching
          owner="evergreen-ci"
          repo="evergreen"
          task={currentTask}
        />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);
    const restartButton = screen.getByRole("button", { name: "Restart Task" });
    expect(restartButton).toBeVisible();
    expect(restartButton).toHaveAttribute("aria-disabled", "false");
  });

  it("shows 'Schedule Task' button if task is inactive", () => {
    const currentTask = {
      ...tasks[5],
      activated: false,
      canSchedule: true,
    };
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[getSpruceConfigMock]}>
        <CommitDetailsCard
          isCurrentTask={false}
          isMatching
          owner="evergreen-ci"
          repo="evergreen"
          task={currentTask}
        />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);
    const scheduleButton = screen.getByRole("button", {
      name: "Schedule Task",
    });
    expect(scheduleButton).toBeVisible();
    expect(scheduleButton).toHaveAttribute("aria-disabled", "false");
  });

  it("can expand and collapse long description", async () => {
    const user = userEvent.setup();
    const longMessage =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    const currentTask = {
      ...tasks[5],
      versionMetadata: {
        ...tasks[5].versionMetadata,
        message: longMessage,
      },
    };
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[getSpruceConfigMock]}>
        <CommitDetailsCard
          isCurrentTask={false}
          isMatching
          owner="evergreen-ci"
          repo="evergreen"
          task={currentTask}
        />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);
    expect(screen.queryByText(longMessage)).toBeNull();

    const showMoreButton = screen.getByRole("button", {
      name: "Show more",
    });
    expect(showMoreButton).toBeVisible();
    await user.click(showMoreButton);
    expect(screen.getByText(longMessage)).toBeVisible();

    const showLessButton = screen.getByRole("button", {
      name: "Show less",
    });
    expect(showLessButton).toBeVisible();
    await user.click(showLessButton);
    expect(screen.queryByText(longMessage)).toBeNull();
  });

  it("can expand and collapse failed tests table", async () => {
    const user = userEvent.setup();
    const currentTask = {
      ...tasks[5],
    };
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[getSpruceConfigMock]}>
        <CommitDetailsCard
          isCurrentTask={false}
          isMatching
          owner="evergreen-ci"
          repo="evergreen"
          task={currentTask}
        />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);

    const accordionContainer = screen.getByDataCy(
      "accordion-collapse-container",
    );
    expect(accordionContainer).toHaveAttribute("aria-expanded", "false");

    const accordionIcon = screen.getByDataCy("accordion-toggle");
    await user.click(accordionIcon);
    expect(accordionContainer).toHaveAttribute("aria-expanded", "true");

    expect(screen.getByDataCy("failing-tests-changes-table")).toBeVisible();
    expect(screen.getAllByDataCy("failing-tests-table-row")).toHaveLength(1);
  });

  it("shows 'This Task' badge if it's the current task", () => {
    const currentTask = {
      ...tasks[5],
    };
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[getSpruceConfigMock]}>
        <CommitDetailsCard
          isCurrentTask
          isMatching
          owner="evergreen-ci"
          repo="evergreen"
          task={currentTask}
        />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);
    const thisTaskBadge = screen.getByDataCy("this-task-badge");
    expect(thisTaskBadge).toBeVisible();
  });

  it("shows correct links", () => {
    const currentTask = {
      ...tasks[5],
      revision: "abcdef",
    };
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[getSpruceConfigMock]}>
        <CommitDetailsCard
          isCurrentTask
          isMatching
          owner="evergreen-ci"
          repo="evergreen"
          task={currentTask}
        />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);
    const githubLink = screen.getByDataCy("github-link");
    expect(githubLink).toHaveAttribute(
      "href",
      `https://github.com/evergreen-ci/evergreen/commit/${currentTask.revision}`,
    );

    const taskLink = screen.getByDataCy("task-link");
    expect(taskLink).toHaveAttribute("href", `/task/${currentTask.id}`);
  });

  it("decreases opacity if isMatching is 'false'", () => {
    const currentTask = {
      ...tasks[5],
    };
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[getSpruceConfigMock]}>
        <CommitDetailsCard
          isCurrentTask={false}
          isMatching={false}
          owner="evergreen-ci"
          repo="evergreen"
          task={currentTask}
        />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);
    const card = screen.getByDataCy("commit-details-card");
    expect(card).toHaveStyle("opacity: 0.4");
  });
});
