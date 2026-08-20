import { MemoryRouter } from "react-router-dom";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  render,
  screen,
  stubGetClientRects,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { HeaderButtons } from "./HeaderButtons";
import * as notificationUtils from "./tabs/NotificationsTab/utils";
import { ProjectType } from "./tabs/utils";

const { saveChangesModal, saveSettings, sendEvent } = vi.hoisted(() => ({
  saveSettings: vi.fn(),
  sendEvent: vi.fn(),
  saveChangesModal: vi.fn(),
}));

vi.mock("@apollo/client/react", () => ({
  useMutation: () => [saveSettings],
}));

vi.mock("analytics", () => ({
  useProjectSettingsAnalytics: () => ({ sendEvent }),
}));

vi.mock("hooks", () => ({
  useHasProjectOrRepoEditPermission: () => ({ canEdit: true }),
}));

vi.mock("./Context", () => ({
  useProjectSettingsContext: () => ({
    getTab: () => ({
      formData: {
        buildBreakSettings: { notifyOnBuildFailure: false },
        subscriptions: [
          {
            subscriptionData: {
              id: "webhook_subscription",
              event: {
                eventSelect: "any-task-finishes",
                extraFields: {},
              },
              notification: {
                notificationSelect: "evergreen-webhook",
                webhookInput: {
                  secretInput: "",
                  urlInput: "https://example.com/webhook",
                  httpHeaders: [],
                  retryInput: 1,
                  minDelayInput: 100,
                  timeoutInput: 1000,
                },
              },
            },
          },
        ],
      },
      hasChanges: true,
      hasError: false,
      initialData: {
        projectId: "project_id",
        projectRef: {
          id: "project_id",
          notifyOnBuildFailure: false,
        },
        subscriptions: [],
      },
    }),
    saveTab: vi.fn(),
  }),
}));

vi.mock("./SaveChangesModal", () => ({
  SaveChangesModal: ({
    after,
    onConfirm,
    open,
  }: {
    after: unknown;
    onConfirm: () => void;
    open: boolean;
  }) => {
    saveChangesModal({ after });
    return open ? (
      <button onClick={onConfirm} type="button">
        Save preview
      </button>
    ) : null;
  },
}));

describe("HeaderButtons", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    saveSettings.mockReset();
    sendEvent.mockReset();
    saveChangesModal.mockReset();
  });

  it("saves the generated webhook secret displayed in the review modal", async () => {
    vi.spyOn(notificationUtils, "generateWebhookSecret").mockReturnValue(
      "preview-secret",
    );
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MemoryRouter>
        <HeaderButtons
          id="project_id"
          projectType={ProjectType.Project}
          tab={ProjectSettingsTabRoutes.Notifications}
        />
      </MemoryRouter>,
    );

    render(<Component />);

    await user.click(
      screen.getByRole("button", { name: "Save changes on page" }),
    );

    expect(saveChangesModal).toHaveBeenLastCalledWith({
      after: expect.objectContaining({
        subscriptions: [
          expect.objectContaining({
            subscriber: expect.objectContaining({
              webhookSubscriber: expect.objectContaining({
                secret: "preview-secret",
              }),
            }),
          }),
        ],
      }),
    });

    await user.click(screen.getByRole("button", { name: "Save preview" }));

    expect(saveSettings).toHaveBeenCalledWith({
      variables: {
        projectSettings: expect.objectContaining({
          subscriptions: [
            expect.objectContaining({
              subscriber: expect.objectContaining({
                webhookSubscriber: expect.objectContaining({
                  secret: "preview-secret",
                }),
              }),
            }),
          ],
        }),
        section: "NOTIFICATIONS",
      },
    });
  });
});
