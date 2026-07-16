import { GroupedFiles } from "./types";
import { filterGroupedFiles } from "./utils";

describe("filterGroupedFiles", () => {
  it("should return an empty array if groupedFiles is empty", () => {
    const groupedFiles: GroupedFiles[] = [];
    const result = filterGroupedFiles(groupedFiles, /(?:)/);
    expect(result).toStrictEqual([]);
  });

  it("should return the original array if search term is empty", () => {
    const groupedFiles = [
      {
        files: [
          {
            associatedLinks: [],
            link: "some_url",
            name: "some_file_name",
          },
        ],
        taskName: "some_task_name",
      },
    ];
    const result = filterGroupedFiles(groupedFiles, /(?:)/);
    expect(result).toStrictEqual(groupedFiles);
  });

  it("should filter the array if search term is not empty", () => {
    const groupedFiles = [
      {
        files: [
          {
            associatedLinks: [],
            link: "some_url",
            name: "some_file_name",
          },
          {
            associatedLinks: [],
            link: "some_url",
            name: "some_other_file_name",
          },
        ],
        taskName: "some_task_name",
      },
    ];
    const search = /some_file_name/;
    const result = filterGroupedFiles(groupedFiles, search);
    expect(result).toStrictEqual([
      {
        files: [
          {
            associatedLinks: [],
            link: "some_url",
            name: "some_file_name",
          },
        ],
        taskName: "some_task_name",
      },
    ]);
  });

  it("should filter across multiple groups", () => {
    const groupedFiles = [
      {
        files: [
          {
            associatedLinks: [],
            link: "some_url",
            name: "some_file_name",
          },
          {
            associatedLinks: [],
            link: "some_url",
            name: "some_other_file_name",
          },
        ],
        taskName: "some_task_name",
      },
      {
        files: [
          {
            associatedLinks: [],
            link: "some_url",
            name: "some_file_name",
          },
          {
            associatedLinks: [],
            link: "some_url",
            name: "some_other_file_name",
          },
        ],
        taskName: "some_other_task_name",
      },
    ];
    const search = /some_file_name/;
    const result = filterGroupedFiles(groupedFiles, search);
    expect(result).toStrictEqual([
      {
        files: [
          {
            associatedLinks: [],
            link: "some_url",
            name: "some_file_name",
          },
        ],
        taskName: "some_task_name",
      },
      {
        files: [
          {
            associatedLinks: [],
            link: "some_url",
            name: "some_file_name",
          },
        ],
        taskName: "some_other_task_name",
      },
    ]);
  });

  it("should not return groups that have no matching files", () => {
    const groupedFiles = [
      {
        files: [
          {
            associatedLinks: [],
            link: "some_url",
            name: "some_matching_file_name",
          },
          {
            associatedLinks: [],
            link: "some_url",
            name: "some_other_file_name",
          },
        ],
        taskName: "some_task_name",
      },
      {
        files: [
          {
            associatedLinks: [],
            link: "some_url",
            name: "some_file_name",
          },
          {
            associatedLinks: [],
            link: "some_url",
            name: "some_other_file_name",
          },
        ],
        taskName: "some_other_task_name",
      },
    ];
    const search = /some_matching_file_name/;
    const result = filterGroupedFiles(groupedFiles, search);
    expect(result).toStrictEqual([
      {
        files: [
          {
            associatedLinks: [],
            link: "some_url",
            name: "some_matching_file_name",
          },
        ],
        taskName: "some_task_name",
      },
    ]);
  });
});
