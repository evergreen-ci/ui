import { usePageTitle } from ".";
import { renderHook } from "../../test_utils";

describe("usePageTitle", () => {
  const originalTitle = "Original Title";

  beforeEach(() => {
    document.title = originalTitle;
  });

  it("should set the document title to the given title", () => {
    const newTitle = "New Page Title";

    renderHook(() => usePageTitle(newTitle));
    expect(document.title).toBe(newTitle);
  });

  it("should reset the document title when the component unmounts", () => {
    const { unmount } = renderHook(() => usePageTitle("Another Title"));
    expect(document.title).toBe("Another Title");

    unmount();
    expect(document.title).toBe(originalTitle);
  });
});
