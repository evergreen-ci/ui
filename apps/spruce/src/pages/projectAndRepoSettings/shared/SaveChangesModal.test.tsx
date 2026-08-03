import {
  render,
  screen,
  stubGetClientRects,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { CustomKeyValueRenderConfig } from "components/Settings/EventLog/EventDiffTable/utils/keyRenderer";
import { ProjectSettingsInput } from "gql/generated/types";
import { SaveChangesModal } from "./SaveChangesModal";

const before: ProjectSettingsInput = {
  projectId: "spruce",
  projectRef: {
    id: "spruce",
    notifyOnBuildFailure: false,
  },
};

const after: ProjectSettingsInput = {
  projectId: "spruce",
  projectRef: {
    id: "spruce",
    notifyOnBuildFailure: true,
  },
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
    expect(
      screen.getByText("projectRef.notifyOnBuildFailure"),
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

    const beforeVars: ProjectSettingsInput = {
      projectId: "spruce",
      projectRef: {
        id: "spruce",
      },
      vars: { vars: { API_TOKEN: "old-secret" } },
    };

    const afterVars: ProjectSettingsInput = {
      projectId: "spruce",
      projectRef: {
        id: "spruce",
      },
      vars: { vars: { API_TOKEN: "new-secret" } },
    };
    renderModal({
      before: beforeVars,
      after: afterVars,
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
