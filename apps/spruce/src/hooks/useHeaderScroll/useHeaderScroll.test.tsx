import { createRef } from "react";
import { renderHook, render } from "@evg-ui/lib/test_utils";
import { scrollPage } from "hooks/test-utils";
import { useHeaderScroll } from ".";

describe("useHeaderScroll", () => {
  const scrollContainerRef = createRef<HTMLDivElement>();
  const scrollContainerId = "scroll-container-id";
  const scrollOffset = 100;

  it("should indicate the page is at top when not scrolled", () => {
    render(<div ref={scrollContainerRef} id={scrollContainerId} />);
    const { result } = renderHook(() =>
      useHeaderScroll(scrollContainerRef, scrollOffset),
    );
    expect(result.current.atTop).toBe(true);
  });

  it("should indicate the page is not at top when scrolled past offset", () => {
    render(<div ref={scrollContainerRef} id={scrollContainerId} />);
    const { result } = renderHook(() =>
      useHeaderScroll(scrollContainerRef, scrollOffset),
    );
    scrollPage(scrollContainerId, scrollOffset);
    expect(result.current.atTop).toBe(false);
  });
});
