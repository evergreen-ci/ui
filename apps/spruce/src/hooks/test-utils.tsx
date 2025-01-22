import { act } from "@evg-ui/lib/test_utils";

export const scrollPage = (scrollContainerId: string, height: number) => {
  act(() => {
    const scrollElement = document.getElementById(
      scrollContainerId,
    ) as HTMLElement;
    scrollElement.scrollTop = height;
    scrollElement.dispatchEvent(new window.Event("scroll"));
  });
};
