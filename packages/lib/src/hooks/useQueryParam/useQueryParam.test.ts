import { renderHook } from "test_utils";
import { useQueryParam } from ".";

vi.mock("react-router-dom", () => ({
  useSearchParams: () => [
    {
      toString: () => "test=value&page=2",
      get: (key: string) => {
        const params: Record<string, string> = { test: "value", page: "2" };
        return params[key] || null;
      },
    },
    vi.fn(),
  ],
  useNavigate: () => vi.fn(),
}));

describe("useQueryParam", () => {
  it("should return the query param value if it exists", () => {
    const { result } = renderHook(() => useQueryParam("test", "default"));
    expect(result.current[0]).toBe("value");
  });

  it("should return the default value if the query param does not exist", () => {
    const { result } = renderHook(() =>
      useQueryParam("nonexistent", "default"),
    );
    expect(result.current[0]).toBe("default");
  });

  it("should return an array if the default value is an array", () => {
    const { result } = renderHook(() => useQueryParam("test", ["default"]));
    expect(Array.isArray(result.current[0])).toBe(true);
  });

  it("should have a function to update the query param", () => {
    const { result } = renderHook(() => useQueryParam("test", "default"));
    expect(typeof result.current[1]).toBe("function");
  });
});
