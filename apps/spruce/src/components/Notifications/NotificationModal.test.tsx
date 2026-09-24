import { useState } from "react";
import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
  within,
} from "@evg-ui/lib/test_utils";
import { SUBSCRIPTION_METHOD } from "constants/cookies";
import { taskTriggers } from "constants/triggers";
import { getUserSettingsMock } from "gql/mocks/getSpruceConfig";
import { getUserMock } from "gql/mocks/getUser";
import { useUserSettings } from "hooks/useUserSettings";
import { NotificationMethods, subscriptionMethods } from "types/subscription";
import { TaskTriggers } from "types/triggers";
import { NotificationModal } from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

const savedCookies: Record<string, string> = {
  "task-notification-trigger": TaskTriggers.TASK_SUCCEEDS,
  [SUBSCRIPTION_METHOD]: NotificationMethods.EMAIL,
};

interface HarnessProps {
  sendAnalyticsEvent?: React.ComponentProps<
    typeof NotificationModal
  >["sendAnalyticsEvent"];
}

// Opening the modal after user settings load mirrors how users reach it from a page.
const ModalHarness: React.FC<HarnessProps> = ({
  sendAnalyticsEvent = vi.fn(),
}) => {
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
        sendAnalyticsEvent={sendAnalyticsEvent}
        subscriptionMethods={subscriptionMethods}
        triggers={taskTriggers}
        type="task"
        visible={visible}
      />
    </>
  );
};

const renderAndOpenModal = async (props: HarnessProps = {}) => {
  const user = userEvent.setup();
  const { Component } = RenderFakeToastContext(
    <MockedProvider mocks={[getUserSettingsMock, getUserMock]}>
      <ModalHarness {...props} />
    </MockedProvider>,
  );
  render(<Component />);
  await user.click(await screen.findByRole("button", { name: "Open" }));
  await waitFor(() => {
    expect(screen.getByTestId("notification-modal")).toBeVisible();
  });
  return { user };
};

const getSelectedMethod = () =>
  within(screen.getByTestId("notification-method-select"));

describe("notificationModal", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("defaults to Slack on outcome with the user's Slack username when nothing is saved", async () => {
    await renderAndOpenModal();
    expect(screen.getByText("This task finishes")).toBeInTheDocument();
    expect(getSelectedMethod().getByText("Slack message")).toBeInTheDocument();
    expect(screen.getByTestId("slack-input")).toHaveValue("@user");
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
      "aria-disabled",
      "false",
    );
  });

  it("uses the user's last selections saved in cookies", async () => {
    mockedGet.mockImplementation((name: string) => savedCookies[name]);
    await renderAndOpenModal();
    expect(screen.getByText("This task succeeds")).toBeInTheDocument();
    expect(getSelectedMethod().getByText("Email")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toHaveValue(
      "admin@evergreen.com",
    );
  });

  it("reports that the initial selection was kept when saving the defaults", async () => {
    const sendAnalyticsEvent = vi.fn();
    const { user } = await renderAndOpenModal({ sendAnalyticsEvent });
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(sendAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(sendAnalyticsEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        subscriber: { type: NotificationMethods.SLACK, target: "@user" },
        trigger: "outcome",
      }),
      { changedInitialSelection: false },
    );
  });
});
