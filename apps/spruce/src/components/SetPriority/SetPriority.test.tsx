import { vi } from "vitest";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  SetTaskPrioritiesMutation,
  SetTaskPrioritiesMutationVariables,
  SetVersionPriorityMutation,
  SetVersionPriorityMutationVariables,
} from "gql/generated/types";
import { SET_TASK_PRIORITIES, SET_VERSION_PRIORITY } from "gql/mutations";
import SetPriority from ".";

describe("setPriority", () => {
  describe("isButton prop", () => {
    it("renders a button when isButton is true", () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider>
          <SetPriority isButton versionId="version_id" />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);
      expect(screen.getByTestId("set-priority-button")).toBeInTheDocument();
    });

    it("does not render a button when isButton is false", () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider>
          <SetPriority onOpenChange={vi.fn()} open versionId="version_id" />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);
      expect(screen.queryByTestId("set-priority-button")).toBeNull();
    });
  });

  describe("patch priority", () => {
    it("shows default message", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setVersionPriority]}>
          <SetPriority onOpenChange={vi.fn()} open versionId="version_id" />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("set-patch-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(screen.queryByTestId("priority-default-message")).toBeVisible();
      await user.type(
        screen.getByRole("textbox", { name: "Set New Priority" }),
        "9",
      );
      expect(screen.queryByTestId("priority-default-message")).toBeVisible();
    });

    it("shows warning message", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setVersionPriority]}>
          <SetPriority onOpenChange={vi.fn()} open versionId="version_id" />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("set-patch-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(screen.queryByTestId("priority-warning-message")).toBeNull();
      await user.type(
        screen.getByRole("textbox", { name: "Set New Priority" }),
        "99",
      );
      expect(screen.queryByTestId("priority-warning-message")).toBeVisible();
    });

    it("shows admin message", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setVersionPriority]}>
          <SetPriority onOpenChange={vi.fn()} open versionId="version_id" />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("set-patch-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(screen.queryByTestId("priority-admin-message")).toBeNull();
      await user.type(
        screen.getByRole("textbox", { name: "Set New Priority" }),
        "999",
      );
      expect(screen.queryByTestId("priority-admin-message")).toBeVisible();
    });

    it("successfully sets priority", async () => {
      const user = userEvent.setup();
      const { Component, dispatchToast } = RenderFakeToastContext(
        <MockedProvider mocks={[setVersionPriority]}>
          <SetPriority onOpenChange={vi.fn()} open versionId="version_id" />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("set-patch-priority-popconfirm"),
        ).toBeVisible();
      });
      await user.type(
        screen.getByRole("textbox", { name: "Set New Priority" }),
        "99",
      );
      await user.click(screen.getByRole("button", { name: "Set" }));
      await waitFor(() => {
        expect(dispatchToast.success).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("task priority", () => {
    it("shows correct initial priority", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority
            initialPriority={10}
            onOpenChange={vi.fn()}
            open
            taskIds={["task_id"]}
          />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("set-task-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(
        screen.getByRole("textbox", { name: "Set New Priority" }),
      ).toHaveValue("10");
    });

    it("shows default message", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority onOpenChange={vi.fn()} open taskIds={["task_id"]} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("set-task-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(screen.queryByTestId("priority-default-message")).toBeVisible();
      await user.type(
        screen.getByRole("textbox", { name: "Set New Priority" }),
        "9",
      );
      expect(screen.queryByTestId("priority-default-message")).toBeVisible();
    });

    it("shows warning message", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority onOpenChange={vi.fn()} open taskIds={["task_id"]} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("set-task-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(screen.queryByTestId("priority-warning-message")).toBeNull();
      await user.type(
        screen.getByRole("textbox", { name: "Set New Priority" }),
        "99",
      );
      expect(screen.queryByTestId("priority-warning-message")).toBeVisible();
    });

    it("shows admin message", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority onOpenChange={vi.fn()} open taskIds={["task_id"]} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("set-task-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(screen.queryByTestId("priority-admin-message")).toBeNull();
      await user.type(
        screen.getByRole("textbox", { name: "Set New Priority" }),
        "999",
      );
      expect(screen.queryByTestId("priority-admin-message")).toBeVisible();
    });

    it("successfully sets priority", async () => {
      const user = userEvent.setup();
      const { Component, dispatchToast } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority onOpenChange={vi.fn()} open taskIds={["task_id"]} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("set-task-priority-popconfirm"),
        ).toBeVisible();
      });
      await user.type(
        screen.getByRole("textbox", { name: "Set New Priority" }),
        "99",
      );
      await user.click(screen.getByRole("button", { name: "Set" }));
      await waitFor(() =>
        expect(dispatchToast.success).toHaveBeenCalledTimes(1),
      );
      await waitFor(() =>
        expect(dispatchToast.success).toHaveBeenCalledWith(
          "Priority updated for 1 task.",
        ),
      );
    });

    it("sets multiple task priorities", async () => {
      const user = userEvent.setup();
      const { Component, dispatchToast } = RenderFakeToastContext(
        <MockedProvider mocks={[setMultipleTaskPriorities]}>
          <SetPriority
            onOpenChange={vi.fn()}
            open
            taskIds={["task_id", "task_id_2"]}
          />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("set-task-priority-popconfirm"),
        ).toBeVisible();
      });
      await user.type(
        screen.getByRole("textbox", { name: "Set New Priority" }),
        "99",
      );
      await user.click(screen.getByRole("button", { name: "Set" }));
      await waitFor(() =>
        expect(dispatchToast.success).toHaveBeenCalledTimes(1),
      );
      await waitFor(() =>
        expect(dispatchToast.success).toHaveBeenCalledWith(
          "Priority updated for 2 tasks.",
        ),
      );
    });
  });
});

const setVersionPriority: ApolloMock<
  SetVersionPriorityMutation,
  SetVersionPriorityMutationVariables
> = {
  request: {
    query: SET_VERSION_PRIORITY,
    variables: { versionId: "version_id", priority: 99 },
  },
  result: {
    data: {
      setVersionPriority: "version_id",
    },
  },
};

const setTaskPriority: ApolloMock<
  SetTaskPrioritiesMutation,
  SetTaskPrioritiesMutationVariables
> = {
  request: {
    query: SET_TASK_PRIORITIES,
    variables: { taskPriorities: [{ taskId: "task_id", priority: 99 }] },
  },
  result: {
    data: {
      setTaskPriorities: [
        {
          __typename: "Task",
          execution: 0,
          id: "task_id",
          priority: 99,
        },
      ],
    },
  },
};

const setMultipleTaskPriorities: ApolloMock<
  SetTaskPrioritiesMutation,
  SetTaskPrioritiesMutationVariables
> = {
  request: {
    query: SET_TASK_PRIORITIES,
    variables: {
      taskPriorities: [
        { taskId: "task_id", priority: 99 },
        { taskId: "task_id_2", priority: 99 },
      ],
    },
  },
  result: {
    data: {
      setTaskPriorities: [
        {
          __typename: "Task",
          execution: 0,
          id: "task_id",
          priority: 99,
        },
        {
          __typename: "Task",
          execution: 0,
          id: "task_id_2",
          priority: 99,
        },
      ],
    },
  },
};
