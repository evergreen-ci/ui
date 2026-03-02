import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { LAST_SELECTED_LOG_TYPE } from "constants/storageKeys";
import ParseLogSelect from ".";

describe("parse log select", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to 'Select...' option if stored value is unset", () => {
    render(
      <ParseLogSelect
        fileName="filename.txt"
        onCancel={vi.fn()}
        onParse={vi.fn()}
      />,
    );
    expect(screen.getByText("Select...")).toBeInTheDocument();
    expect(screen.getByDataCy("process-log-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("defaults to 'Raw' option if stored value is set to evergreen logs", () => {
    localStorage.setItem(LAST_SELECTED_LOG_TYPE, LogRenderingTypes.Default);
    render(
      <ParseLogSelect
        fileName="filename.txt"
        onCancel={vi.fn()}
        onParse={vi.fn()}
      />,
    );
    expect(screen.getByText("Raw")).toBeInTheDocument();
    expect(screen.getByDataCy("process-log-button")).toBeEnabled();
  });

  it("defaults to 'Resmoke' option if stored value is set to resmoke logs", () => {
    localStorage.setItem(LAST_SELECTED_LOG_TYPE, LogRenderingTypes.Resmoke);
    render(
      <ParseLogSelect
        fileName="filename.txt"
        onCancel={vi.fn()}
        onParse={vi.fn()}
      />,
    );
    expect(screen.getByText("Resmoke")).toBeInTheDocument();
    expect(screen.getByDataCy("process-log-button")).toBeEnabled();
  });

  it("clicking the 'Process Log' button calls the onParse function", async () => {
    const user = userEvent.setup();
    localStorage.setItem(LAST_SELECTED_LOG_TYPE, LogTypes.LOGKEEPER_LOGS);
    const onParse = vi.fn();
    render(
      <ParseLogSelect
        fileName="filename.txt"
        onCancel={vi.fn()}
        onParse={onParse}
      />,
    );
    await user.click(screen.getByDataCy("process-log-button"));
    expect(onParse).toHaveBeenCalledTimes(1);
  });

  it("clicking the 'Cancel' button calls the onCancel function", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <ParseLogSelect
        fileName="filename.txt"
        onCancel={onCancel}
        onParse={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
