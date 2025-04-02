import { renderHook } from "test_utils";
import { useOnClickOutside } from ".";

describe("useOnClickOutside", () => {
  it("should call callback when click is outside of refs", () => {
    const mockCallback = vi.fn();
    const divElement = document.createElement("div");
    const ref = { current: divElement };

    document.body.appendChild(divElement);

    renderHook(() => useOnClickOutside([ref], mockCallback));

    const outsideClickEvent = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
    });
    document.body.dispatchEvent(outsideClickEvent);

    expect(mockCallback).toHaveBeenCalledTimes(1);

    document.body.removeChild(divElement);
  });

  it("should not call callback when click is inside of refs", () => {
    const mockCallback = vi.fn();
    const divElement = document.createElement("div");
    const ref = { current: divElement };

    document.body.appendChild(divElement);

    renderHook(() => useOnClickOutside([ref], mockCallback));

    const insideClickEvent = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
    });
    divElement.dispatchEvent(insideClickEvent);

    expect(mockCallback).not.toHaveBeenCalled();

    document.body.removeChild(divElement);
  });
});
