import { act, renderHook, render } from "@evg-ui/lib/test_utils";
import { useTopmostVisibleElement } from ".";

describe("useTopmostVisibleElement", () => {
  const scrollPage = (scrollContainerId: string, height: number) => {
    act(() => {
      const scrollElement = document.getElementById(
        scrollContainerId,
      ) as HTMLElement;
      scrollElement.scrollTop = height;
      scrollElement.dispatchEvent(new window.Event("scroll"));
    });
  };

  it("should correctly detect the topmost visible element", async () => {
    const scrollContainerId = "scroll-container-id";

    render(
      <div id={scrollContainerId}>
        <span id="span-1" />
        <span id="span-2" />
      </div>,
    );

    // JSDom doesn't actually support layouting HTML so scroll/offset positions must be mocked.
    const firstRefElement = document.getElementById("span-1") as HTMLElement;
    vi.spyOn(firstRefElement, "offsetTop", "get").mockImplementation(() => 0);

    const secondRefElement = document.getElementById("span-2") as HTMLElement;
    vi.spyOn(secondRefElement, "offsetTop", "get").mockImplementation(
      () => 500,
    );

    const elements = Array.from(
      document.querySelectorAll("span"),
    ) as HTMLElement[];

    const { result } = renderHook(() =>
      useTopmostVisibleElement({
        elements,
        scrollContainerId,
      }),
    );

    scrollPage(scrollContainerId, 408);
    expect(result.current).toBe("span-2");

    scrollPage(scrollContainerId, 121);
    expect(result.current).toBe("span-1");
  });
});
