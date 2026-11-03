import { PropsWithChildren } from "react";
import { MemoryRouter } from "react-router-dom";
import { renderHook } from "@evg-ui/lib/test_utils";
import { useUserTimeZone } from "hooks";
import { useWaterfallQueryParams } from "./useWaterfallQueryParams";

vi.mock("hooks", () => ({ useUserTimeZone: vi.fn() }));

const setup = (search = "", omitInactiveBuilds = false) =>
  renderHook(
    () =>
      useWaterfallQueryParams({
        projectIdentifier: "spruce",
        omitInactiveBuilds,
      }),
    {
      wrapper: ({ children }: PropsWithChildren) => (
        <MemoryRouter initialEntries={[`/waterfall${search}`]}>
          {children}
        </MemoryRouter>
      ),
    },
  );

describe("useWaterfallQueryParams", () => {
  beforeEach(() => {
    vi.mocked(useUserTimeZone).mockReturnValue(undefined);
  });

  it.each([
    ["requesters", "requesters"],
    ["statuses", "statuses"],
    ["tasks", "tasks"],
    ["buildVariants", "variants"],
  ])("recognizes %s as a server filter", (param, field) => {
    const { result } = setup(`?${param}=first,second`);
    expect(result.current.hasFilters).toBe(true);
    expect(result.current.queryOptions).toMatchObject({
      [field]: ["first", "second"],
      includeAllBuildsAndTasks: false,
    });
  });

  it.each([
    ["requesters", "requesters"],
    ["statuses", "statuses"],
    ["tasks", "tasks"],
    ["buildVariants", "variants"],
  ])("normalizes a single %s value into an array", (param, field) => {
    const { result } = setup(`?${param}=single`);
    expect(result.current.queryOptions).toMatchObject({ [field]: ["single"] });
    expect(result.current.hasFilters).toBe(true);
  });

  it("preserves numeric and boolean-looking filter values as strings", () => {
    const { result } = setup("?tasks=123,true,false&revision=1234567");
    expect(result.current.queryOptions).toMatchObject({
      tasks: ["123", "true", "false"],
      revision: "1234567",
    });
  });

  it("uses empty arrays for missing filters", () => {
    const { result } = setup("?revision=abc123");
    expect(result.current.queryOptions).toMatchObject({
      requesters: [],
      statuses: [],
      tasks: [],
      variants: [],
    });
  });

  it("parses navigation without marking it as a filter", () => {
    const { result } = setup("?maxOrder=20&minOrder=10&revision=abc123");
    expect(result.current.hasFilters).toBe(false);
    expect(result.current.queryOptions).toMatchObject({
      maxOrder: 20,
      minOrder: 10,
      revision: "abc123",
      includeAllBuildsAndTasks: true,
    });
  });

  it.each([
    { timezone: undefined, expected: "2024-09-19T23:59:59Z" },
    { timezone: "America/New_York", expected: "2024-09-20T03:59:59Z" },
  ])(
    "converts the date to end of day using $timezone",
    ({ expected, timezone }) => {
      vi.mocked(useUserTimeZone).mockReturnValue(timezone);
      const { result } = setup("?date=2024-09-19");
      expect(result.current.queryOptions.date).toEqual(new Date(expected));
      expect(result.current.hasFilters).toBe(false);
    },
  );

  it.each([
    { search: "?tasks=task", enabled: true, expected: false },
    { search: "?buildVariants=variant", enabled: true, expected: true },
    { search: "?buildVariants=variant", enabled: false, expected: false },
  ])(
    "only omits inactive builds with a variant filter and enabled setting: $search, $enabled",
    ({ enabled, expected, search }) => {
      const { result } = setup(search, enabled);
      expect(result.current.queryOptions.omitInactiveBuilds).toBe(expected);
    },
  );
});
