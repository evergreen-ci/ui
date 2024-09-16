import { SorterResult } from "antd/es/table/interface";
import {
  SortDirection,
  TaskSortCategory,
  Task,
  SortOrder,
} from "gql/generated/types";
import { parseSortString, toSortString } from "./sortString";

describe("parseSortString", () => {
  it("should parse a sort string with multiple sorts", () => {
    expect(
      parseSortString<"Key", "Direction", TaskSortCategory, SortOrder>(
        "NAME:ASC;STATUS:DESC",
        {
          sortByKey: "Key",
          sortDirKey: "Direction",
          sortCategoryEnum: TaskSortCategory,
        },
      ),
    ).toStrictEqual([
      {
        Key: TaskSortCategory.Name,
        Direction: SortDirection.Asc,
      },
      {
        Key: TaskSortCategory.Status,
        Direction: SortDirection.Desc,
      },
    ]);
  });
  enum Categories {
    Apple = "apple",
    Banana = "banana",
    Pear = "pear",
  }
  it("should partially process invalid sort strings", () => {
    expect(
      parseSortString<
        "cat",
        "dir",
        Categories,
        { cat: Categories; dir: SortDirection }
      >("apple:ASC;pear:DESC;invalidCat:DESC", {
        sortByKey: "cat",
        sortDirKey: "dir",
        sortCategoryEnum: Categories,
      }),
    ).toStrictEqual([
      {
        cat: Categories.Apple,
        dir: SortDirection.Asc,
      },
      {
        cat: Categories.Pear,
        dir: SortDirection.Desc,
      },
    ]);
  });
  it("can accept an array of strings", () => {
    expect(
      parseSortString<
        "cat",
        "dir",
        Categories,
        { cat: Categories; dir: SortDirection }
      >(["apple:ASC", "pear:DESC"], {
        sortByKey: "cat",
        sortDirKey: "dir",
        sortCategoryEnum: Categories,
      }),
    ).toStrictEqual([
      {
        cat: Categories.Apple,
        dir: SortDirection.Asc,
      },
      {
        cat: Categories.Pear,
        dir: SortDirection.Desc,
      },
    ]);
  });
});

describe("toSortString", () => {
  it("should convert a sort value into a sort string", () => {
    const input: SorterResult<Task> = {
      columnKey: TaskSortCategory.Name,
      order: "descend",
    };
    expect(toSortString(input)).toBe("NAME:DESC");
  });
  it("should return undefined when there is an invalid sort value", () => {
    const unsetSort: SorterResult<Task> = {
      columnKey: TaskSortCategory.Status,
      order: undefined,
    };
    expect(toSortString(unsetSort)).toBeUndefined();
  });
  it("should take a multi sort and convert it into a sort string", () => {
    const multiSort: SorterResult<Task>[] = [
      {
        columnKey: TaskSortCategory.Status,
        order: undefined,
      },
      {
        columnKey: TaskSortCategory.BaseStatus,
        order: "ascend",
      },
    ];
    expect(toSortString(multiSort)).toBe("BASE_STATUS:ASC");
  });
});
