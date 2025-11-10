import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import ParseLogSelect from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

describe("parse log select", () => {
  it("defaults to 'Select...' option if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
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

  it("defaults to 'Raw' option if cookie is set to evergreen logs", () => {
    mockedGet.mockImplementation(() => LogRenderingTypes.Default);
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

  it("defaults to 'Resmoke' option if cookie is set to resmoke logs", () => {
    mockedGet.mockImplementation(() => LogRenderingTypes.Resmoke);
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
    mockedGet.mockImplementation(() => LogTypes.EVERGREEN_COMPLETE_LOGS);
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
