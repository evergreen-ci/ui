import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  SetVersionPriorityMutation,
  SetVersionPriorityMutationVariables,
  SetTaskPrioritiesMutation,
  SetTaskPrioritiesMutationVariables,
} from "gql/generated/types";
import { SET_VERSION_PRIORITY, SET_TASK_PRIORITIES } from "gql/mutations";
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
      expect(screen.getByDataCy("set-priority-button")).toBeInTheDocument();
    });

    it("renders a menu item when isButton is false", () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider>
          <SetPriority versionId="version_id" />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);
      expect(screen.getByDataCy("set-priority-menu-item")).toBeInTheDocument();
    });
  });

  describe("patch priority", () => {
    it("shows default message", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setVersionPriority]}>
          <SetPriority versionId="version_id" />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.getByDataCy("set-priority-menu-item"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-patch-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(screen.queryByDataCy("priority-default-message")).toBeVisible();
      await user.type(screen.getByDataCy("patch-priority-input"), "9");
      expect(screen.queryByDataCy("priority-default-message")).toBeVisible();
    });

    it("shows warning message", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setVersionPriority]}>
          <SetPriority versionId="version_id" />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.getByDataCy("set-priority-menu-item"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-patch-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(screen.queryByDataCy("priority-warning-message")).toBeNull();
      await user.type(screen.getByDataCy("patch-priority-input"), "99");
      expect(screen.queryByDataCy("priority-warning-message")).toBeVisible();
    });

    it("shows admin message", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setVersionPriority]}>
          <SetPriority versionId="version_id" />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.getByDataCy("set-priority-menu-item"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-patch-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(screen.queryByDataCy("priority-admin-message")).toBeNull();
      await user.type(screen.getByDataCy("patch-priority-input"), "999");
      expect(screen.queryByDataCy("priority-admin-message")).toBeVisible();
    });

    it("successfully sets priority", async () => {
      const user = userEvent.setup();
      const { Component, dispatchToast } = RenderFakeToastContext(
        <MockedProvider mocks={[setVersionPriority]}>
          <SetPriority versionId="version_id" />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.getByDataCy("set-priority-menu-item"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-patch-priority-popconfirm"),
        ).toBeVisible();
      });
      await user.type(screen.getByDataCy("patch-priority-input"), "99");
      await user.click(screen.getByRole("button", { name: "Set" }));
      expect(dispatchToast.success).toHaveBeenCalledTimes(1);
    });
  });

  describe("task priority", () => {
    it("shows correct initial priority", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority initialPriority={10} taskIds={["task_id"]} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.getByDataCy("set-priority-menu-item"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-task-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(screen.queryByDataCy("task-priority-input")).toHaveValue(10);
    });

    it("shows default message", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority taskIds={["task_id"]} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.getByDataCy("set-priority-menu-item"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-task-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(screen.queryByDataCy("priority-default-message")).toBeVisible();
      await user.type(screen.getByDataCy("task-priority-input"), "9");
      expect(screen.queryByDataCy("priority-default-message")).toBeVisible();
    });

    it("shows warning message", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority taskIds={["task_id"]} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.getByDataCy("set-priority-menu-item"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-task-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(screen.queryByDataCy("priority-warning-message")).toBeNull();
      await user.type(screen.getByDataCy("task-priority-input"), "99");
      expect(screen.queryByDataCy("priority-warning-message")).toBeVisible();
    });

    it("shows admin message", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority taskIds={["task_id"]} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.getByDataCy("set-priority-menu-item"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-task-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(screen.queryByDataCy("priority-admin-message")).toBeNull();
      await user.type(screen.getByDataCy("task-priority-input"), "999");
      expect(screen.queryByDataCy("priority-admin-message")).toBeVisible();
    });

    it("successfully sets priority", async () => {
      const user = userEvent.setup();
      const { Component, dispatchToast } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority taskIds={["task_id"]} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.getByDataCy("set-priority-menu-item"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-task-priority-popconfirm"),
        ).toBeVisible();
      });
      await user.type(screen.getByDataCy("task-priority-input"), "99");
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
          <SetPriority taskIds={["task_id", "task_id_2"]} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.getByDataCy("set-priority-menu-item"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-task-priority-popconfirm"),
        ).toBeVisible();
      });
      await user.type(screen.getByDataCy("task-priority-input"), "99");
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
