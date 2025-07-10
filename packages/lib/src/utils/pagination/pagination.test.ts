import { RECENT_PAGE_SIZE_KEY, DEFAULT_PAGE_SIZE } from "constants/pagination";
import { getDefaultPageSize } from "./index";

describe("getDefaultPageSize", () => {
  let originalLocalStorage: Storage;

  beforeEach(() => {
    // Save original localStorage and mock it
    originalLocalStorage = globalThis.localStorage;
    let store: Record<string, string> = {};
    globalThis.localStorage = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      key: vi.fn(),
      length: 0,
    } as unknown as Storage;
  });

  afterEach(() => {
    // Restore original localStorage
    globalThis.localStorage = originalLocalStorage;
    vi.restoreAllMocks();
  });

  it("returns the default page size if localStorage is empty", () => {
    expect(getDefaultPageSize()).toBe(DEFAULT_PAGE_SIZE);
  });

  it("returns the value from localStorage if it is a valid page size", () => {
    globalThis.localStorage.setItem(RECENT_PAGE_SIZE_KEY, "20");
    expect(getDefaultPageSize()).toBe(20);
  });

  it("returns the default page size if localStorage value is not a valid page size", () => {
    globalThis.localStorage.setItem(RECENT_PAGE_SIZE_KEY, "999");
    expect(getDefaultPageSize()).toBe(DEFAULT_PAGE_SIZE);
  });

  it("returns the default page size if localStorage value is not a number", () => {
    globalThis.localStorage.setItem(RECENT_PAGE_SIZE_KEY, "not-a-number");
    expect(getDefaultPageSize()).toBe(DEFAULT_PAGE_SIZE);
  });

  it("returns the default page size if localStorage value is null", () => {
    globalThis.localStorage.setItem(RECENT_PAGE_SIZE_KEY, "");
    expect(getDefaultPageSize()).toBe(DEFAULT_PAGE_SIZE);
  });
});
