import { MemoryRouter, useLocation } from "react-router-dom";
import { act, renderHook } from "@evg-ui/lib/test_utils";
import { useTableSort } from ".";

describe("useTableSort", () => {
  it("sets ascending sort", () => {
    const analytics = vi.fn();
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?page=0"]}>{children}</MemoryRouter>
    );

    const { result } = renderHook(
      () => ({
        location: useLocation(),
        sort: useTableSort({ sendAnalyticsEvents: analytics }),
      }),
      {
        wrapper,
      },
    );
    act(() => {
      result.current.sort([{ id: "distroId", desc: false }]);
    });
    expect(result.current.location.search).toBe("?page=0&sorts=distroId%3AASC");
    expect(analytics).toHaveBeenCalledTimes(1);
  });

  it("sets descending sort", () => {
    const analytics = vi.fn();
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?page=0"]}>{children}</MemoryRouter>
    );

    const { result } = renderHook(
      () => ({
        location: useLocation(),
        sort: useTableSort({ sendAnalyticsEvents: analytics }),
      }),
      {
        wrapper,
      },
    );
    act(() => {
      result.current.sort([{ id: "distroId", desc: true }]);
    });
    expect(result.current.location.search).toBe(
      "?page=0&sorts=distroId%3ADESC",
    );
    expect(analytics).toHaveBeenCalledTimes(1);
  });

  it("overwrites existing sort", () => {
    const analytics = vi.fn();
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?page=0&sorts=foo%3AASC"]}>
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(
      () => ({
        location: useLocation(),
        sort: useTableSort({ sendAnalyticsEvents: analytics }),
      }),
      {
        wrapper,
      },
    );
    act(() => {
      result.current.sort([{ id: "bar", desc: false }]);
    });
    expect(result.current.location.search).toBe("?page=0&sorts=bar%3AASC");
    expect(analytics).toHaveBeenCalledTimes(1);
  });

  it("resets page to zero on sort", () => {
    const analytics = vi.fn();
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?page=1"]}>{children}</MemoryRouter>
    );

    const { result } = renderHook(
      () => ({
        location: useLocation(),
        sort: useTableSort({ sendAnalyticsEvents: analytics }),
      }),
      {
        wrapper,
      },
    );
    act(() => {
      result.current.sort([{ id: "foo", desc: false }]);
    });
    expect(result.current.location.search).toBe("?page=0&sorts=foo%3AASC");
    expect(analytics).toHaveBeenCalledTimes(1);
  });

  it("clears sort", () => {
    const analytics = vi.fn();
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?page=0&sorts=foo%3AASC"]}>
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(
      () => ({
        location: useLocation(),
        sort: useTableSort({ sendAnalyticsEvents: analytics }),
      }),
      {
        wrapper,
      },
    );
    act(() => {
      result.current.sort([]);
    });
    expect(result.current.location.search).toBe("?page=0");
    expect(analytics).toHaveBeenCalledTimes(1);
  });

  it("updates query params when multi-sort is applied", () => {
    const analytics = vi.fn();
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?page=0&sorts=foo%3AASC"]}>
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(
      () => ({
        location: useLocation(),
        sort: useTableSort({ sendAnalyticsEvents: analytics }),
      }),
      {
        wrapper,
      },
    );
    act(() => {
      result.current.sort([
        { id: "distroId", desc: false },
        { id: "status", desc: true },
      ]);
    });
    expect(result.current.location.search).toBe(
      "?page=0&sorts=distroId%3AASC%3Bstatus%3ADESC",
    );
    expect(analytics).toHaveBeenCalledTimes(1);
  });
});
