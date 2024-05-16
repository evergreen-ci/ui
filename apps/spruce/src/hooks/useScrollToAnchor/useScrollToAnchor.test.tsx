import { MemoryRouter } from "react-router-dom";
import { renderHook } from "test_utils";
import useScrollToAnchor from ".";

describe("useScrollToAnchor", () => {
  const mockElement = { scrollIntoView: jest.fn() };

  beforeEach(() => {
    jest.useFakeTimers();
    jest
      .spyOn(document, "getElementById")
      .mockImplementation()
      .mockReturnValue(mockElement as any as HTMLElement);
    mockElement.scrollIntoView.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should scroll to element when hash is present", () => {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={["/#test-anchor"]}>{children}</MemoryRouter>
    );

    renderHook(() => useScrollToAnchor(), { wrapper });
    jest.advanceTimersByTime(500);

    expect(document.getElementById).toHaveBeenCalledWith("test-anchor");
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
    });
  });

  it("should not scroll when hash is not present", () => {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
    );

    renderHook(() => useScrollToAnchor(), { wrapper });
    jest.advanceTimersByTime(500);

    expect(document.getElementById).not.toHaveBeenCalled();
  });

  it("should clear timeout on unmount", () => {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={["/#test-anchor"]}>{children}</MemoryRouter>
    );

    const { unmount } = renderHook(() => useScrollToAnchor(), { wrapper });
    unmount();
    jest.advanceTimersByTime(500);

    expect(mockElement.scrollIntoView).not.toHaveBeenCalled();
  });
});
