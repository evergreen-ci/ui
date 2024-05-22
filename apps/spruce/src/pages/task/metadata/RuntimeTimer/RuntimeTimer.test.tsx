import { render, screen, waitFor, act } from "test_utils";
import RuntimeTimer from ".";

describe("runtimeTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(global, "setInterval");
    vi.spyOn(global, "clearInterval");
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  it("counts up as the run time progresses", async () => {
    // 10 seconds ago
    const startTime = new Date(Date.now() - 10000);
    render(<RuntimeTimer startTime={startTime} />);
    expect(screen.getByText("Running Time: 10s")).toBeInTheDocument();
    act(() => {
      vi.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.getByText("Running Time: 11s")).toBeInTheDocument();
    });
    act(() => {
      vi.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.getByText("Running Time: 12s")).toBeInTheDocument();
    });
  });
});
