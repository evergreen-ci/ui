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
import { RestartToastMessage } from ".";

const taskId = "task_id";

describe("restartToastMessage", () => {
  it("subscribes the user to a Slack message when the task finishes", async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    const onSubscribe = vi.fn();
    render(
      <MockedProvider mocks={[saveTaskSubscriptionMock]}>
        <RestartToastMessage
          message="Task scheduled to restart."
          onError={onError}
          onOpenModal={vi.fn()}
          onSubscribe={onSubscribe}
          resourceId={taskId}
          slackUsername="user"
          type="task"
        />
      </MockedProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: "Slack me on outcome" }),
    );
    expect(onSubscribe).toHaveBeenCalledTimes(1);
    expect(onSubscribe).toHaveBeenCalledWith(taskSubscription);
    expect(await screen.findByText("Subscribed.")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Slack me on outcome" }),
    ).not.toBeInTheDocument();
  });

  it("reports an error and keeps the link when subscribing fails", async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    render(
      <MockedProvider mocks={[saveTaskSubscriptionErrorMock]}>
        <RestartToastMessage
          message="Task scheduled to restart."
          onError={onError}
          onOpenModal={vi.fn()}
          onSubscribe={vi.fn()}
          resourceId={taskId}
          slackUsername="user"
          type="task"
        />
      </MockedProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: "Slack me on outcome" }),
    );
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        "Error adding your subscription: 'Failed to save subscription'",
      );
    });
    expect(screen.queryByText("Subscribed.")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Slack me on outcome" }),
    ).toBeEnabled();
  });
});

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
