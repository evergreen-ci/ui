import { overwriteFakeTimers } from "test_utils";
import debounce from ".";

describe("debounce", () => {
  beforeAll(() => {
    overwriteFakeTimers();
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should debounce the function", () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);
    debouncedFn();
    expect(fn).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(fn).toHaveBeenCalledWith();
  });
});
