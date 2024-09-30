import { MemoryRouter } from "react-router-dom";
import { renderHook, act } from "@evg-ui/lib/test_utils";
import { RECENT_PAGE_SIZE_KEY } from "constants/index";
import { getDefaultPageSize } from "utils/url";
import usePagination from "./index";

describe("usePagination", () => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const wrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;

  beforeEach(() => {
    // Mock localStorage
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return the default page and limit", () => {
    const { result } = renderHook(() => usePagination(), { wrapper });

    expect(result.current.page).toBe(0);
    expect(result.current.limit).toBe(getDefaultPageSize());
  });

  it("should update the page", () => {
    const { result } = renderHook(() => usePagination(), { wrapper });

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.page).toBe(2);
  });

  it("should update the limit and save it to localStorage", () => {
    const { result } = renderHook(() => usePagination(), { wrapper });

    act(() => {
      result.current.setLimit(50);
    });

    expect(result.current.limit).toBe(50);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      RECENT_PAGE_SIZE_KEY,
      "50",
    );
  });
  it("should reset the page when the limit is updated", () => {
    const { result } = renderHook(() => usePagination(), { wrapper });

    act(() => {
      result.current.setPage(2);
    });

    act(() => {
      result.current.setLimit(50);
    });
    expect(result.current.page).toBe(0);
  });
});
