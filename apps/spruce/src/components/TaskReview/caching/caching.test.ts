import { StoreObject, FieldFunctionOptions } from "@apollo/client";
import { waitFor } from "@evg-ui/lib/test_utils";
import { readTaskReviewed } from ".";

vi.mock("idb", () => ({
  openDB: vi.fn().mockResolvedValue({
    get: vi
      .fn()
      .mockResolvedValue(undefined)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false),
  }),
}));

const cacheModifyMock = vi.fn();

const readOptions = (storage = {}) =>
  ({
    cache: {
      identify: vi.fn(),
      modify: cacheModifyMock,
    },
    readField(key: string, obj: StoreObject) {
      return obj && obj[key];
    },
    storage,
  }) as unknown as FieldFunctionOptions;

describe("readTaskReviewed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns true value returned from db", async () => {
    const options = readOptions();
    await waitFor(() => {
      expect(readTaskReviewed(undefined, options)).toBe(true);
    });
    expect(cacheModifyMock).toHaveBeenCalledOnce();
  });

  it("returns false value returned from db", async () => {
    const options = readOptions();
    await waitFor(() => {
      expect(readTaskReviewed(undefined, options)).toBe(false);
    });
    expect(cacheModifyMock).toHaveBeenCalledOnce();
  });

  it("returns false when not found in db", async () => {
    const options = readOptions();
    await waitFor(() => {
      expect(readTaskReviewed(undefined, options)).toBe(false);
    });
    expect(cacheModifyMock).toHaveBeenCalledOnce();
  });

  it("returns cached value when included", () => {
    const options = readOptions();
    expect(readTaskReviewed(false, options)).toBe(false);
    expect(readTaskReviewed(true, options)).toBe(true);
    expect(cacheModifyMock).not.toHaveBeenCalled();
  });
});
