import { render, screen, waitFor, act } from "@evg-ui/lib/test_utils";
import { ETARow } from ".";

describe("ETARow", () => {
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
      <ETARow expectedDuration={expectedDuration} startTime={startTime} />,
    );
    expect(screen.getByText("10s")).toBeInTheDocument();
    act(() => {
      vi.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.getByText("9s")).toBeInTheDocument();
    });
    act(() => {
      vi.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.getByText("8s")).toBeInTheDocument();
    });
  });

  it("stops counting down when it reaches 0", async () => {
    const startTime = new Date();
    const expectedDuration = 1000;
    render(
      <ETARow expectedDuration={expectedDuration} startTime={startTime} />,
    );
    expect(screen.getByText("1s")).toBeInTheDocument();
    act(() => {
      vi.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.getByText("0s")).toBeInTheDocument();
    });
    expect(global.clearInterval).toHaveBeenCalledTimes(2);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not render if the ETA has been exceeded", () => {
    const startTime = new Date(Date.now() - 10000);
    render(<ETARow expectedDuration={0} startTime={startTime} />);
    expect(screen.queryByText("ETA")).not.toBeInTheDocument();
  });
});
