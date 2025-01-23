import { createRef } from "react";
import { renderHook, render } from "@evg-ui/lib/test_utils";
import { scrollPage } from "hooks/test-utils";
import { useIsScrollAtTop } from ".";

describe("useIsScrollAtTop", () => {
  const scrollContainerRef = createRef<HTMLDivElement>();
  const scrollContainerId = "scroll-container-id";
  const scrollOffset = 100;

  describe("should indicate the page is at top", () => {
    it("when not scrolled at all", () => {
      render(<div ref={scrollContainerRef} id={scrollContainerId} />);
      const { result } = renderHook(() =>
        useIsScrollAtTop(scrollContainerRef, scrollOffset),
      );
      expect(result.current.atTop).toBe(true);
    });

    it("when not scrolled past offset", () => {
      render(<div ref={scrollContainerRef} id={scrollContainerId} />);
      const { result } = renderHook(() =>
        useIsScrollAtTop(scrollContainerRef, scrollOffset),
      );
      scrollPage(scrollContainerId, scrollOffset / 2);
      expect(result.current.atTop).toBe(true);
    });
  });

  describe("should indicate the page is not at top", () => {
    it("when scrolled past offset", () => {
      render(<div ref={scrollContainerRef} id={scrollContainerId} />);
      const { result } = renderHook(() =>
        useIsScrollAtTop(scrollContainerRef, scrollOffset),
      );
      scrollPage(scrollContainerId, scrollOffset);
      expect(result.current.atTop).toBe(false);
    });
  });
});
