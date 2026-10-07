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
} from "gql/generated/types";
import { SAVE_SUBSCRIPTION } from "gql/mutations";
import { RestartToastMessage, RestartToastMessageProps } from ".";

const taskId = "task_id";

describe("restartToastMessage", () => {
  it("subscribes the user to a Slack message when the task finishes", async () => {
    const onSubscribe = vi.fn();
    const user = setupToast([saveTaskSubscriptionMock], { onSubscribe });

    await clickNotifyAction(user);
    await waitFor(() => {
      expect(onSubscribe).toHaveBeenCalledWith(taskSubscription);
    });
    expect(
      await screen.findByText("✓ Slack notification added"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Slack when finished" }),
    ).not.toBeInTheDocument();
  });

  it("reports an error and keeps the action when subscribing fails", async () => {
    const onError = vi.fn();
    const user = setupToast([saveTaskSubscriptionErrorMock], { onError });

    await clickNotifyAction(user);
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        "Error adding your subscription: 'Failed to save subscription'",
      );
    });
    expect(
      screen.queryByText("✓ Slack notification added"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Slack when finished" }),
    ).toBeEnabled();
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
        onError={vi.fn()}
        onSubscribe={vi.fn()}
        resourceId={taskId}
        slackUsername="user"
        type="task"
        {...props}
      />
    </MockedProvider>,
  );
  return user;
};

const clickNotifyAction = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(
    await screen.findByRole("button", { name: "Slack when finished" }),
  );

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
