import { useState } from "react";
import Cookies from "js-cookie";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
  within,
} from "@evg-ui/lib/test_utils";
import {
  SUBSCRIPTION_METHOD,
  getNotificationTriggerCookie,
} from "constants/cookies";
import { taskTriggers } from "constants/triggers";
import { getUserSettingsMock } from "gql/mocks/getSpruceConfig";
import { getUserMock } from "gql/mocks/getUser";
import { useUserSettings } from "hooks/useUserSettings";
import { selectLGOption } from "test_utils/utils";
import { subscriptionMethods } from "types/subscription";
import { NotificationModal } from ".";

// Opening the modal after user settings load mirrors how users reach it from a page.
const ModalHarness = () => {
  const [visible, setVisible] = useState(false);
  const { userSettings } = useUserSettings();
  return (
    <>
      {userSettings.slackUsername && (
        <button onClick={() => setVisible(true)} type="button">
          Open
        </button>
      )}
      <NotificationModal
        data-testid="notification-modal"
        onCancel={() => setVisible(false)}
        resourceId="task_id"
        sendAnalyticsEvent={vi.fn()}
        subscriptionMethods={subscriptionMethods}
        triggers={taskTriggers}
        type="task"
        visible={visible}
      />
    </>
  );
};

const openModal = async () => {
  const user = userEvent.setup();
  const { Component } = RenderFakeToastContext(
    <MockedProvider mocks={[getUserSettingsMock, getUserMock]}>
      <ModalHarness />
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
});
