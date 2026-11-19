import Cookies from "js-cookie";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
  UserSettingsQuery,
  UserSettingsQueryVariables,
} from "gql/generated/types";
import { getUserSettingsMock } from "gql/mocks/getSpruceConfig";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { SlackNotificationBanner } from "./SlackNotificationBanner";

describe("slackNotificationBanner", () => {
  beforeEach(() => {
    Cookies.remove("has-closed-slack-banner");
  });

  it("saves the Slack username from the popconfirm", async () => {
    const consoleError = vi.spyOn(console, "error");
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider
        mocks={[
          noSlackUserSettingsMock,
          updateUserSettingsMock,
          getUserSettingsMock,
        ]}
      >
        <SlackNotificationBanner />
      </MockedProvider>,
    );
    render(<Component />);

    expect(
      await screen.findByTestId("slack-notification-banner"),
    ).toBeVisible();
    await user.click(screen.getByTestId("subscribe-to-notifications"));
    await user.type(screen.getByTestId("slack-username-input"), "me");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledTimes(1);
    });
    expect(screen.queryByTestId("slack-notification-banner")).toBeNull();
    const nestingErrors = consoleError.mock.calls.filter(([msg]) =>
      String(msg).includes("validateDOMNesting"),
    );
    expect(nestingErrors).toHaveLength(0);
  });

  it("hides the banner when dismissed", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[noSlackUserSettingsMock]}>
        <SlackNotificationBanner />
      </MockedProvider>,
    );
    render(<Component />);

    expect(
      await screen.findByTestId("slack-notification-banner"),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByTestId("slack-notification-banner")).toBeNull();
  });
});

const noSlackUserSettingsMock: ApolloMock<
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
          slackUsername: "",
        },
      },
    },
  },
};

const updateUserSettingsMock: ApolloMock<
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables
> = {
  request: {
    query: UPDATE_USER_SETTINGS,
    variables: {
      userSettings: {
        slackUsername: "me",
        notifications: { patchFinish: "slack", patchFirstFailure: "slack" },
      },
    },
  },
  result: { data: { updateUserSettings: true } },
};
