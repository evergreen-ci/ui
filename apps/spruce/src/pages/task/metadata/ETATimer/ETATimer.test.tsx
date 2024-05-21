import { render, screen, waitFor, act } from "test_utils";
import ETATimer from ".";

describe("etaTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(global, "setInterval");
    vi.spyOn(global, "clearInterval");
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  it("counts down", async () => {
    const startTime = new Date();
    const expectedDuration = 10000;
    render(
      <ETATimer startTime={startTime} expectedDuration={expectedDuration} />,
    );
    expect(screen.getByText("ETA: 10s")).toBeInTheDocument();
    act(() => {
      vi.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.getByText("ETA: 9s")).toBeInTheDocument();
    });
    act(() => {
      vi.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.getByText("ETA: 8s")).toBeInTheDocument();
    });
  });
  it("stops counting down when it reaches 0", async () => {
    const startTime = new Date();
    const expectedDuration = 1000;
    render(
      <ETATimer startTime={startTime} expectedDuration={expectedDuration} />,
    );
    expect(screen.getByText("ETA: 1s")).toBeInTheDocument();
    act(() => {
      vi.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.getByText("ETA: 0s")).toBeInTheDocument();
    });
    expect(global.clearInterval).toHaveBeenCalledTimes(2);
    expect(vi.getTimerCount()).toBe(0);
  });
  it("if the eta has been exceeded, it does not render", () => {
    render(<ETATimer startTime={new Date()} expectedDuration={0} />);
    expect(screen.queryByTestId("task-metadata-eta")).not.toBeInTheDocument();
  });
});
