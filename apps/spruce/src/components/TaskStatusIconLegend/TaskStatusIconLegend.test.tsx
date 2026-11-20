import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { TaskStatusIconLegend } from ".";

const sendEvent = vi.fn();
vi.mock("analytics", () => ({
  useWaterfallAnalytics: () => ({ sendEvent }),
}));

describe("taskStatusIconLegend", () => {
  beforeEach(() => {
    sendEvent.mockClear();
  });

  it("opens from the trigger and closes from the close button", async () => {
    const user = userEvent.setup();
    render(<TaskStatusIconLegend />);
    expect(screen.queryByText("Icon Legend")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Task status icon legend" }),
    );
    expect(screen.getByText("Icon Legend")).toBeInTheDocument();
    expect(sendEvent).toHaveBeenLastCalledWith({
      name: "Toggled task icon legend",
      open: true,
    });

    await user.click(
      screen.getByRole("button", { name: "Close task status icon legend" }),
    );
    await waitFor(() => {
      expect(screen.queryByText("Icon Legend")).not.toBeInTheDocument();
    });
    expect(sendEvent).toHaveBeenLastCalledWith({
      name: "Toggled task icon legend",
      open: false,
    });
  });

  it("closes on Escape from inside the legend", async () => {
    const user = userEvent.setup();
    render(<TaskStatusIconLegend />);
    await user.click(
      screen.getByRole("button", { name: "Task status icon legend" }),
    );
    expect(screen.getByText("Icon Legend")).toBeInTheDocument();
    screen
      .getByRole("button", { name: "Close task status icon legend" })
      .focus();
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByText("Icon Legend")).not.toBeInTheDocument();
    });
  });

  it("closes on outside click", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Outside</button>
        <TaskStatusIconLegend />
      </>,
    );
    await user.click(
      screen.getByRole("button", { name: "Task status icon legend" }),
    );
    expect(screen.getByText("Icon Legend")).toBeInTheDocument();
    await user.click(document.body);
    await waitFor(() => {
      expect(screen.queryByText("Icon Legend")).not.toBeInTheDocument();
    });
  });
});
