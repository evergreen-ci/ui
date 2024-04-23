import { MemoryRouter } from "react-router-dom";
import { RECENT_PAGE_SIZE_KEY } from "constants/index";
import { renderHook, act } from "test_utils";
import { getDefaultPageSize } from "utils/url";
import useTablePagination from "./index";

describe("useTablePagination", () => {
  const wrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;

  beforeEach(() => {
    // Mock localStorage
    jest.spyOn(Storage.prototype, "setItem").mockImplementation();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return the default page and limit", () => {
    const { result } = renderHook(() => useTablePagination(), { wrapper });

    expect(result.current.page).toBe(0);
    expect(result.current.limit).toBe(getDefaultPageSize());
  });

  it("should update the page", () => {
    const { result } = renderHook(() => useTablePagination(), { wrapper });

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.page).toBe(2);
  });

  it("should update the limit and save it to localStorage", () => {
    const { result } = renderHook(() => useTablePagination(), { wrapper });

    act(() => {
      result.current.setPageLimit(50);
    });

    expect(result.current.limit).toBe(50);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      RECENT_PAGE_SIZE_KEY,
      "50",
    );
  });
});
