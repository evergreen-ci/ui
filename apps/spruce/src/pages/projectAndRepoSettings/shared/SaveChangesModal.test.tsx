import {
  render,
  screen,
  stubGetClientRects,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { CustomKeyValueRenderConfig } from "components/Settings/EventLog/EventDiffTable/utils/keyRenderer";
import { JSONObject } from "utils/object/types";
import { SaveChangesModal } from "./SaveChangesModal";

const before: JSONObject = {
  notifyOnBuildFailure: false,
  subscriptions: [{ slackChannel: "#old" }],
};

const after: JSONObject = {
  notifyOnBuildFailure: true,
  subscriptions: [{ slackChannel: "#new" }],
};

const renderModal = (
  props: Partial<React.ComponentProps<typeof SaveChangesModal>> = {},
) =>
  render(
    <SaveChangesModal
      after={after}
      before={before}
      onCancel={() => {}}
      onConfirm={() => {}}
      open
      tabTitle="Notifications"
      {...props}
    />,
  );

describe("SaveChangesModal", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  it("includes the tab title in the modal header", () => {
    renderModal();
    expect(
      screen.getByText("Review changes to Notifications"),
    ).toBeInTheDocument();
  });

  it("renders the diff table when before and after differ", () => {
    renderModal();
    expect(screen.getByDataCy("event-diff-table")).toBeInTheDocument();
    // One row per changed leaf property.
    expect(screen.getByText("notifyOnBuildFailure")).toBeInTheDocument();
    expect(
      screen.getByText("subscriptions[0].slackChannel"),
    ).toBeInTheDocument();
  });

  it("renders a no-changes message when before and after are equal", () => {
    renderModal({ after: before });
    expect(screen.queryByDataCy("event-diff-table")).not.toBeInTheDocument();
    expect(screen.getByText("No changes detected.")).toBeInTheDocument();
  });

  it("renders a no-changes message when both before and after are null", () => {
    renderModal({ after: null, before: null });
    expect(screen.queryByDataCy("event-diff-table")).not.toBeInTheDocument();
    expect(screen.getByText("No changes detected.")).toBeInTheDocument();
  });

  it("fires onCancel when the cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    renderModal({ onCancel, onConfirm });

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("fires onConfirm when the save button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    renderModal({ onCancel, onConfirm });

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("applies customKeyValueRenderConfig to matching keys", () => {
    const customKeyValueRenderConfig: CustomKeyValueRenderConfig = {
      "vars.vars": () => <span data-cy="masked-value">REDACTED</span>,
    };
    renderModal({
      before: { vars: { vars: { API_TOKEN: "old-secret" } } },
      after: { vars: { vars: { API_TOKEN: "new-secret" } } },
      customKeyValueRenderConfig,
    });

    // Two masked cells (Before + After) rendered through the custom renderer.
    expect(screen.getAllByDataCy("masked-value")).toHaveLength(2);
    expect(screen.queryByText(/old-secret/)).not.toBeInTheDocument();
    expect(screen.queryByText(/new-secret/)).not.toBeInTheDocument();
  });

  it("is not rendered when open is false", () => {
    renderModal({ open: false });
    expect(screen.queryByDataCy("save-changes-modal")).not.toBeVisible();
  });
});
