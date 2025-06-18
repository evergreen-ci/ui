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
