import { MemoryRouter } from "react-router-dom";
import { act, renderHook } from "test_utils";
import { useVersionRefresh } from ".";

vi.mock("../../utils/environmentVariables", () => ({
  isLocal: vi.fn(() => false),
}));

const { isLocal } = await import("../../utils/environmentVariables");

const createWrapper = (initialEntries: string[] = ["/"]) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
  return Wrapper;
};

describe("useVersionRefresh", () => {
  let metaTag: HTMLMetaElement;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.mocked(isLocal).mockReturnValue(false);

    metaTag = document.createElement("meta");
    metaTag.setAttribute("name", "git-hash");
    metaTag.setAttribute("content", "abc123");
    document.head.appendChild(metaTag);

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("abc123", { status: 200 }),
    );
  });

  afterEach(() => {
    document.head.removeChild(metaTag);
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("skips fetch when isLocal() is true", () => {
    vi.mocked(isLocal).mockReturnValue(true);
    const { result } = renderHook(() => useVersionRefresh(), {
      wrapper: createWrapper(),
    });
    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(result.current).toBe(false);
  });

  it("fetches /commit.txt on location change", async () => {
    renderHook(() => useVersionRefresh(), {
      wrapper: createWrapper(),
    });
    await vi.advanceTimersByTimeAsync(0);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/commit.txt",
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  it("returns true when hashes differ", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response("def456", { status: 200 }),
    );
    const { result } = renderHook(() => useVersionRefresh(), {
      wrapper: createWrapper(),
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current).toBe(true);
  });

  it("returns false when hashes match", async () => {
    const { result } = renderHook(() => useVersionRefresh(), {
      wrapper: createWrapper(),
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current).toBe(false);
  });

  it("rate-limits: skips fetch if called within 60s", async () => {
    const { rerender } = renderHook(() => useVersionRefresh(), {
      wrapper: createWrapper(),
    });
    await vi.advanceTimersByTimeAsync(0);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    rerender();
    await vi.advanceTimersByTimeAsync(0);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("handles fetch failure gracefully", async () => {
    vi.mocked(globalThis.fetch).mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useVersionRefresh(), {
      wrapper: createWrapper(),
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current).toBe(false);
  });

  it("skips when meta tag is missing", () => {
    document.head.removeChild(metaTag);

    try {
      const { result } = renderHook(() => useVersionRefresh(), {
        wrapper: createWrapper(),
      });
      expect(globalThis.fetch).not.toHaveBeenCalled();
      expect(result.current).toBe(false);
    } finally {
      const placeholder = document.createElement("meta");
      placeholder.setAttribute("name", "git-hash");
      placeholder.setAttribute("content", "abc123");
      document.head.appendChild(placeholder);
      metaTag = placeholder;
    }
  });
});
