import { createRef } from "react";
import { act, renderHook, render } from "@evg-ui/lib/test_utils";
import { useFindClosestRef } from ".";

describe("useFindClosestRef", () => {
  const scrollPage = (scrollContainerId: string, height: number) => {
    act(() => {
      const scrollElement = document.getElementById(
        scrollContainerId,
      ) as HTMLElement;
      scrollElement.scrollTop = height;
      scrollElement.dispatchEvent(new window.Event("scroll"));
    });
  };

  it("should correctly set the active index as the index of the closest ref", async () => {
    const ref1 = createRef<HTMLDivElement>();
    const ref2 = createRef<HTMLDivElement>();
    const setActiveIndex = vi.fn();
    const scrollContainerId = "scroll-container-id";

    render(
      <div id={scrollContainerId}>
        <span ref={ref1} id="ref-1" />
        <span ref={ref2} id="ref-2" />
      </div>,
    );

    // JSDom doesn't actually support layouting HTML so scroll/offset positions must be mocked.
    const firstRefElement = document.getElementById("ref-1") as HTMLElement;
    vi.spyOn(firstRefElement, "offsetTop", "get").mockImplementation(() => 0);

    const secondRefElement = document.getElementById("ref-2") as HTMLElement;
    vi.spyOn(secondRefElement, "offsetTop", "get").mockImplementation(
      () => 500,
    );

    renderHook(() =>
      useFindClosestRef({
        refs: [ref1, ref2],
        setActiveIndex,
        scrollContainerId,
      }),
    );

    scrollPage(scrollContainerId, 408);
    expect(setActiveIndex).toHaveBeenCalledWith(1);

    scrollPage(scrollContainerId, 121);
    expect(setActiveIndex).toHaveBeenCalledWith(0);
  });
});
