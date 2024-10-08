import { renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { useFetch } from ".";

const API_URL = "http://test-evergreen.com/some/endpoint";
const jsonMessage = {
  anotherKey: "anotherValue",
  key: "value",
  someNumber: 123,
};
describe("useFetch", () => {
  it("gets a good response from the api and updates its state", async () => {
    const mockFetchPromise = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(jsonMessage),
      ok: true,
    });
    vi.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

    const { result } = renderHook(() => useFetch(API_URL));
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toStrictEqual(jsonMessage);
  });
  it("gets a bad response from the api and returns an error", async () => {
    const mockFetchPromise = vi
      .fn()
      .mockRejectedValue(new Error("Something went wrong"));
    vi.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

    const { result } = renderHook(() => useFetch(API_URL));
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.error).toBe("Something went wrong");
  });
  it("skips the fetch if the skip option is supplied", async () => {
    const fetch = vi.fn();
    vi.spyOn(global, "fetch").mockImplementation(fetch);
    const { result } = renderHook(() => useFetch(API_URL, { skip: true }));
    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
  it("makes a request if skip is changed from true to false", async () => {
    const mockFetchPromise = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(jsonMessage),
      ok: true,
    });

    let skip = true;
    vi.spyOn(global, "fetch").mockImplementation(mockFetchPromise);
    const { rerender, result } = renderHook(() => useFetch(API_URL, { skip }));
    expect(mockFetchPromise).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    skip = false;
    rerender();
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => {
      expect(mockFetchPromise).toHaveBeenCalledTimes(1);
    });
  });
});
