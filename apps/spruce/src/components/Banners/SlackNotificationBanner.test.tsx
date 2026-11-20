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
  UserSettingsQuery,
  UserSettingsQueryVariables,
} from "gql/generated/types";
import { getUserSettingsMock } from "gql/mocks/getSpruceConfig";
import { SlackNotificationBanner } from "./SlackNotificationBanner";

const renderBanner = () => {
  const { Component } = RenderFakeToastContext(
    <MockedProvider mocks={[noSlackUserSettingsMock]}>
      <SlackNotificationBanner />
    </MockedProvider>,
  );
  render(<Component />);
};

describe("slackNotificationBanner", () => {
  beforeEach(() => {
    Cookies.remove("has-closed-slack-banner");
  });

  it("opens the subscribe popconfirm without invalid DOM nesting", async () => {
    const consoleError = vi.spyOn(console, "error");
    const user = userEvent.setup();
    renderBanner();

    expect(
      await screen.findByTestId("slack-notification-banner"),
    ).toBeVisible();
    await user.click(screen.getByTestId("subscribe-to-notifications"));
    await waitFor(() => {
      expect(screen.getByTestId("slack-username-input")).toBeVisible();
    });
    const nestingErrors = consoleError.mock.calls.filter(([msg]) =>
      String(msg).includes("validateDOMNesting"),
    );
    expect(nestingErrors).toHaveLength(0);
  });

  it("hides the banner when dismissed", async () => {
    const user = userEvent.setup();
    renderBanner();

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
