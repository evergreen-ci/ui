import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  RestartTaskMutation,
  RestartTaskMutationVariables,
  SaveSubscriptionForUserMutation,
  SaveSubscriptionForUserMutationVariables,
  UserSettingsQuery,
  UserSettingsQueryVariables,
} from "gql/generated/types";
import { getUserSettingsMock } from "gql/mocks/getSpruceConfig";
import { getUserMock } from "gql/mocks/getUser";
import { RESTART_TASK, SAVE_SUBSCRIPTION } from "gql/mutations";
import { taskData } from "./MarkReviewed/taskData";
import { RestartButton } from "./RestartButton";

const { mockSendEvent } = vi.hoisted(() => ({ mockSendEvent: vi.fn() }));
vi.mock("analytics", () => ({
  useTaskAnalytics: () => ({ sendEvent: mockSendEvent }),
}));

const renderRestartButton = (
  userSettingsMock: ApolloMock<
    UserSettingsQuery,
    UserSettingsQueryVariables
  > = getUserSettingsMock,
) => {
  const { Component, dispatchToast } = RenderFakeToastContext(
    <MockedProvider
      mocks={[
        { ...userSettingsMock, maxUsageCount: Number.POSITIVE_INFINITY },
        { ...getUserMock, maxUsageCount: Number.POSITIVE_INFINITY },
        restartTaskMock,
      ]}
    >
      <RestartButton isDisplayTask={false} task={taskData} />
    </MockedProvider>,
  );
  render(<Component />);
  return { dispatchToast };
};

describe("restartButton", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("subscribes the user from the toast and records it as a restart toast subscription", async () => {
    const user = userEvent.setup();
    const { dispatchToast } = renderRestartButton();
    await user.click(screen.getByRole("button", { name: "Restart" }));
    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledTimes(1);
    });

    expect(mockSendEvent).toHaveBeenCalledWith({
      name: "Viewed restart notification prompt",
    });

    const toastMessage = vi.mocked(dispatchToast.success).mock.calls[0][0];
    render(
      <MockedProvider mocks={[saveSubscriptionMock]}>
        <div>{toastMessage}</div>
      </MockedProvider>,
    );
    await user.click(
      screen.getByRole("button", { name: "Slack me on outcome" }),
    );
    expect(await screen.findByText("Subscribed.")).toBeInTheDocument();
    expect(mockSendEvent).toHaveBeenCalledWith({
      name: "Created notification",
      "notification.source": "restart_toast",
      "subscription.type": "slack",
      "subscription.trigger": "outcome",
    });
  });

  it("shows the plain restart toast when the user has no Slack username", async () => {
    const user = userEvent.setup();
    const { dispatchToast } = renderRestartButton(userSettingsWithoutSlackMock);
    await user.click(screen.getByRole("button", { name: "Restart" }));
    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledTimes(1);
    });
    expect(dispatchToast.success).toHaveBeenCalledWith(
      "Task scheduled to restart.",
    );
    expect(mockSendEvent).not.toHaveBeenCalledWith({
      name: "Viewed restart notification prompt",
    });
  });
});

const userSettingsWithoutSlackMock: ApolloMock<
  UserSettingsQuery,
  UserSettingsQueryVariables
> = {
  ...getUserSettingsMock,
  result: {
    data: {
      user: {
        ...getUserSettingsMock.result!.data!.user,
        settings: {
          ...getUserSettingsMock.result!.data!.user.settings,
          slackMemberId: "",
          slackUsername: "",
        },
      },
    },
  },
};

const restartTaskMock: ApolloMock<
  RestartTaskMutation,
  RestartTaskMutationVariables
> = {
  request: {
    query: RESTART_TASK,
    variables: {
      taskId: taskData.id,
      failedOnly: false,
    },
  },
  result: {
    data: {
      restartTask: {
        __typename: "Task",
        buildVariant: taskData.buildVariant,
        buildVariantDisplayName: taskData.buildVariantDisplayName,
        displayName: taskData.displayName,
        displayStatus: "will-run",
        execution: 1,
        id: taskData.id,
        latestExecution: 1,
        priority: 0,
        revision: taskData.revision,
      },
    },
  },
};

const saveSubscriptionMock: ApolloMock<
  SaveSubscriptionForUserMutation,
  SaveSubscriptionForUserMutationVariables
> = {
  request: {
    query: SAVE_SUBSCRIPTION,
    variables: {
      subscription: {
        owner_type: "person",
        regex_selectors: [],
        resource_type: "TASK",
        selectors: [
          { type: "object", data: "task" },
          { type: "id", data: taskData.id },
        ],
        subscriber: { type: "slack", target: "@user" },
        trigger: "outcome",
        trigger_data: {},
      },
    },
  },
  result: { data: { saveSubscription: true } },
};
