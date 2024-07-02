import { SortDirection, TaskSortCategory } from "gql/generated/types";
import { parseSortString, toSortString } from "./sortString";

describe("parseSortString", () => {
  it("should parse a sort string with multiple sorts", () => {
    expect(parseSortString("NAME:ASC;STATUS:DESC", "columnKey")).toStrictEqual([
      {
        columnKey: TaskSortCategory.Name,
        direction: SortDirection.Asc,
      },
      {
        columnKey: TaskSortCategory.Status,
        direction: SortDirection.Desc,
      },
    ]);
  });
  it("should not parse an invalid sort string", () => {
    expect(parseSortString("FOO:fase", "columnKey")).toStrictEqual([]);
  });
});

describe("toSortString", () => {
  it("should convert a sort value into a sort string", () => {
    const input = {
      columnKey: TaskSortCategory.Name,
      direction: SortDirection.Desc,
    };
    expect(toSortString([input], "columnKey")).toBe("NAME:DESC");
  });
  it("should return undefined when there is an invalid sort value", () => {
    const unsetSort = {
      columnKey: TaskSortCategory.Status,
      direction: undefined,
    };
    expect(toSortString([unsetSort], "columnKey")).toBe("");
  });
  it("should take a multi sort and convert it into a sort string", () => {
    const multiSort = [
      {
        columnKey: TaskSortCategory.Status,
        direction: undefined,
      },
      {
        columnKey: TaskSortCategory.BaseStatus,
        direction: SortDirection.Asc,
      },
    ];
    expect(toSortString(multiSort, "columnKey")).toBe("BASE_STATUS:ASC");
  });
});
