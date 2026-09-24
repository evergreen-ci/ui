import { useState } from "react";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
  within,
} from "@evg-ui/lib/test_utils";
import { taskTriggers } from "constants/triggers";
import { getUserSettingsMock } from "gql/mocks/getSpruceConfig";
import { getUserMock } from "gql/mocks/getUser";
import { useUserSettings } from "hooks/useUserSettings";
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

describe("notificationModal", () => {
  it("defaults to Slack on outcome with the user's Slack username when nothing is saved", async () => {
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
});
