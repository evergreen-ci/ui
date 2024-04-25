import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  SetVersionPriorityMutation,
  SetVersionPriorityMutationVariables,
  SetTaskPriorityMutation,
  SetTaskPriorityMutationVariables,
} from "gql/generated/types";
import { SET_VERSION_PRIORITY, SET_TASK_PRIORITY } from "gql/mutations";
import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import SetPriority from ".";

describe("setPriority", () => {
  describe("patch priority", () => {
    it("shows default message", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setVersionPriority]}>
          <SetPriority versionId="version_id" />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.queryByDataCy("prioritize-patch"));
      expect(
        screen.queryByDataCy("set-patch-priority-popconfirm"),
      ).toBeVisible();
      expect(screen.queryByDataCy("priority-default-message")).toBeVisible();
      await user.type(screen.queryByDataCy("patch-priority-input"), "9");
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

      await user.click(screen.queryByDataCy("prioritize-patch"));
      expect(
        screen.queryByDataCy("set-patch-priority-popconfirm"),
      ).toBeVisible();
      expect(screen.queryByDataCy("priority-warning-message")).toBeNull();
      await user.type(screen.queryByDataCy("patch-priority-input"), "99");
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

      await user.click(screen.queryByDataCy("prioritize-patch"));
      expect(
        screen.queryByDataCy("set-patch-priority-popconfirm"),
      ).toBeVisible();
      expect(screen.queryByDataCy("priority-admin-message")).toBeNull();
      await user.type(screen.queryByDataCy("patch-priority-input"), "999");
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

      await user.click(screen.queryByDataCy("prioritize-patch"));
      expect(
        screen.queryByDataCy("set-patch-priority-popconfirm"),
      ).toBeVisible();
      await user.type(screen.queryByDataCy("patch-priority-input"), "99");
      await user.click(screen.getByRole("button", { name: "Set" }));
      expect(dispatchToast.success).toHaveBeenCalledTimes(1);
    });
  });

  describe("task priority", () => {
    it("shows correct initial priority", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority taskId="task_id" initialPriority={10} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.queryByDataCy("prioritize-task"));
      expect(
        screen.queryByDataCy("set-task-priority-popconfirm"),
      ).toBeVisible();
      expect(screen.queryByDataCy("task-priority-input")).toHaveValue(10);
    });

    it("shows default message", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority taskId="task_id" />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.queryByDataCy("prioritize-task"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-task-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(screen.queryByDataCy("priority-default-message")).toBeVisible();
      await user.type(screen.queryByDataCy("task-priority-input"), "9");
      expect(screen.queryByDataCy("priority-default-message")).toBeVisible();
    });

    it("shows warning message", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority taskId="task_id" />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.queryByDataCy("prioritize-task"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-task-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(screen.queryByDataCy("priority-warning-message")).toBeNull();
      await user.type(screen.queryByDataCy("task-priority-input"), "99");
      expect(screen.queryByDataCy("priority-warning-message")).toBeVisible();
    });

    it("shows admin message", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority taskId="task_id" />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.queryByDataCy("prioritize-task"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-task-priority-popconfirm"),
        ).toBeVisible();
      });
      expect(screen.queryByDataCy("priority-admin-message")).toBeNull();
      await user.type(screen.queryByDataCy("task-priority-input"), "999");
      expect(screen.queryByDataCy("priority-admin-message")).toBeVisible();
    });

    it("successfully sets priority", async () => {
      const user = userEvent.setup();
      const { Component, dispatchToast } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority taskId="task_id" />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.queryByDataCy("prioritize-task"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-task-priority-popconfirm"),
        ).toBeVisible();
      });
      await user.type(screen.queryByDataCy("task-priority-input"), "99");
      await user.click(screen.getByRole("button", { name: "Set" }));
      await waitFor(() =>
        expect(dispatchToast.success).toHaveBeenCalledTimes(1),
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
  SetTaskPriorityMutation,
  SetTaskPriorityMutationVariables
> = {
  request: {
    query: SET_TASK_PRIORITY,
    variables: { taskId: "task_id", priority: 99 },
  },
  result: {
    data: {
      setTaskPriority: {
        __typename: "Task",
        execution: 0,
        id: "task_id",
        priority: 99,
      },
    },
  },
};
