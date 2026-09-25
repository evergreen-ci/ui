import { GraphQLError } from "graphql";
import {
  MockedProvider,
  render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  SaveSubscriptionForUserMutation,
  SaveSubscriptionForUserMutationVariables,
  UserSettingsQuery,
  UserSettingsQueryVariables,
} from "gql/generated/types";
import { getUserSettingsMock } from "gql/mocks/getSpruceConfig";
import { SAVE_SUBSCRIPTION } from "gql/mutations";
import { RestartToastMessage, RestartToastMessageProps } from ".";

const taskId = "task_id";

describe("restartToastMessage", () => {
  it("subscribes the user to a Slack message when the task finishes", async () => {
    const onSubscribe = vi.fn();
    const user = setupToast([getUserSettingsMock, saveTaskSubscriptionMock], {
      onSubscribe,
    });

    await clickNotifyLink(user);
    await waitFor(() => {
      expect(onSubscribe).toHaveBeenCalledWith(taskSubscription);
    });
    expect(await screen.findByText(/Subscribed\./)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Slack me on outcome" }),
    ).not.toBeInTheDocument();
  });

  it("reports an error and keeps the link when subscribing fails", async () => {
    const onError = vi.fn();
    const user = setupToast(
      [getUserSettingsMock, saveTaskSubscriptionErrorMock],
      { onError },
    );

    await clickNotifyLink(user);
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        "Error adding your subscription: 'Failed to save subscription'",
      );
    });
    expect(screen.queryByText(/Subscribed\./)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Slack me on outcome" }),
    ).toBeEnabled();
  });

  it("opens the notification modal when the user has no Slack username", async () => {
    const onOpenModal = vi.fn();
    const onSubscribe = vi.fn();
    const user = setupToast([noSlackUsernameMock], {
      onOpenModal,
      onSubscribe,
    });

    await clickNotifyLink(user);
    await waitFor(() => {
      expect(onOpenModal).toHaveBeenCalledTimes(1);
    });
    expect(onSubscribe).not.toHaveBeenCalled();
  });
});

const setupToast = (
  mocks: ApolloMock<unknown, unknown>[],
  props: Partial<RestartToastMessageProps>,
) => {
  const user = userEvent.setup();
  render(
    <MockedProvider mocks={mocks}>
      <RestartToastMessage
        message="Task scheduled to restart."
        onError={vi.fn()}
        onOpenModal={vi.fn()}
        onSubscribe={vi.fn()}
        resourceId={taskId}
        type="task"
        {...props}
      />
    </MockedProvider>,
  );
  return user;
};

const clickNotifyLink = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole("button", { name: "Slack me on outcome" }));

const noSlackUsernameMock: ApolloMock<
  UserSettingsQuery,
  UserSettingsQueryVariables
> = {
  request: getUserSettingsMock.request,
  result: {
    data: {
      user: {
        ...getUserSettingsMock.result!.data!.user,
        settings: {
          ...getUserSettingsMock.result!.data!.user.settings,
          slackUsername: "",
        },
      },
    },
  },
};

const taskSubscription: SaveSubscriptionForUserMutationVariables["subscription"] =
  {
    owner_type: "person",
    regex_selectors: [],
    resource_type: "TASK",
    selectors: [
      { type: "object", data: "task" },
      { type: "id", data: taskId },
    ],
    subscriber: { type: "slack", target: "@user" },
    trigger: "outcome",
    trigger_data: {},
  };

const saveTaskSubscriptionMock: ApolloMock<
  SaveSubscriptionForUserMutation,
  SaveSubscriptionForUserMutationVariables
> = {
  request: {
    query: SAVE_SUBSCRIPTION,
    variables: { subscription: taskSubscription },
  },
  result: { data: { saveSubscription: true } },
};

const saveTaskSubscriptionErrorMock: ApolloMock<
  SaveSubscriptionForUserMutation,
  SaveSubscriptionForUserMutationVariables
> = {
  request: saveTaskSubscriptionMock.request,
  result: { errors: [new GraphQLError("Failed to save subscription")] },
};
