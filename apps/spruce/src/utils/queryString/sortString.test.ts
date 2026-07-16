import {
  SortDirection,
  TaskSortCategory,
  SortOrder,
} from "gql/generated/types";
import { parseSortString } from "./sortString";

describe("parseSortString", () => {
  it("should parse a sort string with multiple sorts", () => {
    expect(
      parseSortString<"Key", "Direction", TaskSortCategory, SortOrder>(
        "NAME:ASC;STATUS:DESC",
        {
          sortByKey: "Key",
          sortCategoryEnum: TaskSortCategory,
          sortDirKey: "Direction",
        },
      ),
    ).toStrictEqual([
      {
        Direction: SortDirection.Asc,
        Key: TaskSortCategory.Name,
      },
      {
        Direction: SortDirection.Desc,
        Key: TaskSortCategory.Status,
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
        sortCategoryEnum: Categories,
        sortDirKey: "dir",
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
        sortCategoryEnum: Categories,
        sortDirKey: "dir",
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
