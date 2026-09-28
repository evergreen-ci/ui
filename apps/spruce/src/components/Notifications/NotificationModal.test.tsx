import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import Cookies from "js-cookie";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  MockedProviderProps,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
  within,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  SUBSCRIPTION_METHOD,
  getNotificationTriggerCookie,
} from "constants/cookies";
import { taskTriggers } from "constants/triggers";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
  UserQuery,
  UserSettingsQuery,
  UserSettingsQueryVariables,
} from "gql/generated/types";
import { getUserSettingsMock } from "gql/mocks/getSpruceConfig";
import { getUserMock } from "gql/mocks/getUser";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { USER } from "gql/queries";
import { useUserSettings } from "hooks/useUserSettings";
import { selectLGOption } from "test_utils/utils";
import {
  NotificationModalSource,
  subscriptionMethods,
} from "types/subscription";
import { NotificationModal, NotificationModalProps } from ".";

// Opening the modal after the user and their settings load mirrors how users reach it from a page.
const ModalHarness = ({
  sendEvent = vi.fn(),
}: {
  sendEvent?: NotificationModalProps["sendEvent"];
}) => {
  const [visible, setVisible] = useState(false);
  const { loading: userSettingsLoading } = useUserSettings();
  const { loading: userLoading } = useQuery<UserQuery>(USER);
  return (
    <>
      {!userSettingsLoading && !userLoading && (
        <button onClick={() => setVisible(true)} type="button">
          Open
        </button>
      )}
      <NotificationModal
        data-testid="notification-modal"
        onCancel={() => setVisible(false)}
        resourceId="task_id"
        sendEvent={sendEvent}
        source={NotificationModalSource.NotifyMeButton}
        subscriptionMethods={subscriptionMethods}
        triggers={taskTriggers}
        type="task"
        visible={visible}
      />
    </>
  );
};

const openModal = async ({
  mocks = [getUserSettingsWithSlackMock("user"), getUserMock],
  sendEvent,
}: {
  mocks?: MockedProviderProps["mocks"];
  sendEvent?: NotificationModalProps["sendEvent"];
} = {}) => {
  const user = userEvent.setup();
  const { Component } = RenderFakeToastContext(
    <MockedProvider mocks={mocks}>
      <ModalHarness sendEvent={sendEvent} />
    </MockedProvider>,
  );
  render(<Component />);
  await user.click(await screen.findByRole("button", { name: "Open" }));
  await waitFor(() => {
    expect(screen.getByTestId("notification-modal")).toBeVisible();
  });
  return user;
};

describe("notificationModal", () => {
  afterEach(() => {
    Cookies.remove(getNotificationTriggerCookie("task"));
    Cookies.remove(SUBSCRIPTION_METHOD);
  });

  it("defaults to Slack on outcome with the user's Slack username when nothing is saved", async () => {
    await openModal();

    expect(screen.getByText("This task finishes")).toBeInTheDocument();
    expect(
      within(screen.getByTestId("notification-method-select")).getByText(
        "Slack message",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("slack-input")).toHaveValue("@user");
    expect(
      screen.queryByTestId("save-slack-username-checkbox"),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
      "aria-disabled",
      "false",
    );
  });

  it("remembers the selections when the user saves", async () => {
    const user = await openModal();
    await selectLGOption("notification-method-select", "Email");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(Cookies.get(getNotificationTriggerCookie("task"))).toBe(
      "task-finishes",
    );
    expect(Cookies.get(SUBSCRIPTION_METHOD)).toBe("email");
  });

  it("does not change the remembered selections when the user cancels", async () => {
    const user = await openModal();
    await selectLGOption("notification-method-select", "Email");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(Cookies.get(getNotificationTriggerCookie("task"))).toBeUndefined();
    expect(Cookies.get(SUBSCRIPTION_METHOD)).toBeUndefined();
  });

  describe("saving a typed Slack username", () => {
    it("does not offer to save a Slack channel", async () => {
      const user = await openModal({
        mocks: [userSettingsWithoutSlackMock, getUserMock],
      });
      await user.type(screen.getByTestId("slack-input"), "#evergreen");
      expect(
        screen.queryByTestId("save-slack-username-checkbox"),
      ).not.toBeInTheDocument();
    });

    it("saves the typed Slack username to user settings when checked", async () => {
      const sendEvent = vi.fn();
      const user = await openModal({
        mocks: [
          userSettingsWithoutSlackMock,
          getUserMock,
          updateSlackUsernameMock,
          getUserSettingsWithSlackMock("new.user"),
        ],
        sendEvent,
      });
      await user.type(screen.getByTestId("slack-input"), "@new.user");
      await user.click(screen.getByText("Save Slack username to my settings"));
      await user.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(updateSlackUsernameResult).toHaveBeenCalledTimes(1);
      });
      expect(sendEvent).toHaveBeenCalledWith({
        name: "Created notification",
        "notification.source": NotificationModalSource.NotifyMeButton,
        "slack_username.saved": true,
        "subscription.changed_initial_selection": false,
        "subscription.type": "slack",
        "subscription.trigger": "outcome",
      });
    });

    it("does not save the typed Slack username when unchecked", async () => {
      const sendEvent = vi.fn();
      const user = await openModal({
        mocks: [userSettingsWithoutSlackMock, getUserMock],
        sendEvent,
      });
      await user.type(screen.getByTestId("slack-input"), "@new.user");
      expect(
        screen.getByTestId("save-slack-username-checkbox"),
      ).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(sendEvent).toHaveBeenCalledWith(
        expect.objectContaining({ "slack_username.saved": false }),
      );
    });
  });
});

// The user ID must match getUserMock's; otherwise the two queries overwrite each other's cached user and refetch.
const getUserSettingsWithSlackMock = (
  slackUsername: string,
): ApolloMock<UserSettingsQuery, UserSettingsQueryVariables> => ({
  request: getUserSettingsMock.request,
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "admin",
        settings: {
          ...getUserSettingsMock.result?.data?.user.settings,
          slackUsername,
        },
      },
    },
  },
});

const userSettingsWithoutSlackMock = getUserSettingsWithSlackMock("");

const updateSlackUsernameResult = vi.fn(
  (): { data: UpdateUserSettingsMutation } => ({
    data: { updateUserSettings: true },
  }),
);

// Typed with Apollo's mock type because it accepts a result function, which lets the test assert the mutation ran.
const updateSlackUsernameMock: NonNullable<
  MockedProviderProps["mocks"]
>[number] = {
  request: {
    query: UPDATE_USER_SETTINGS,
    variables: {
      userSettings: { slackUsername: "new.user" },
    } satisfies UpdateUserSettingsMutationVariables,
  },
  result: updateSlackUsernameResult,
};
