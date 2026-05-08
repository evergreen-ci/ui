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
        taskName: "some_task_name",
        files: [
          {
            name: "some_file_name",
            link: "some_url",
            associatedLinks: [],
          },
        ],
      },
    ];
    const result = filterGroupedFiles(groupedFiles, /(?:)/);
    expect(result).toStrictEqual(groupedFiles);
  });

  it("should filter the array if search term is not empty", () => {
    const groupedFiles = [
      {
        taskName: "some_task_name",
        files: [
          {
            name: "some_file_name",
            link: "some_url",
            associatedLinks: [],
          },
          {
            name: "some_other_file_name",
            link: "some_url",
            associatedLinks: [],
          },
        ],
      },
    ];
    const search = /some_file_name/;
    const result = filterGroupedFiles(groupedFiles, search);
    expect(result).toStrictEqual([
      {
        taskName: "some_task_name",
        files: [
          {
            name: "some_file_name",
            link: "some_url",
            associatedLinks: [],
          },
        ],
      },
    ]);
  });

  it("should filter across multiple groups", () => {
    const groupedFiles = [
      {
        taskName: "some_task_name",
        files: [
          {
            name: "some_file_name",
            link: "some_url",
            associatedLinks: [],
          },
          {
            name: "some_other_file_name",
            link: "some_url",
            associatedLinks: [],
          },
        ],
      },
      {
        taskName: "some_other_task_name",
        files: [
          {
            name: "some_file_name",
            link: "some_url",
            associatedLinks: [],
          },
          {
            name: "some_other_file_name",
            link: "some_url",
            associatedLinks: [],
          },
        ],
      },
    ];
    const search = /some_file_name/;
    const result = filterGroupedFiles(groupedFiles, search);
    expect(result).toStrictEqual([
      {
        taskName: "some_task_name",
        files: [
          {
            name: "some_file_name",
            link: "some_url",
            associatedLinks: [],
          },
        ],
      },
      {
        taskName: "some_other_task_name",
        files: [
          {
            name: "some_file_name",
            link: "some_url",
            associatedLinks: [],
          },
        ],
      },
    ]);
  });

  it("should not return groups that have no matching files", () => {
    const groupedFiles = [
      {
        taskName: "some_task_name",
        files: [
          {
            name: "some_matching_file_name",
            link: "some_url",
            associatedLinks: [],
          },
          {
            name: "some_other_file_name",
            link: "some_url",
            associatedLinks: [],
          },
        ],
      },
      {
        taskName: "some_other_task_name",
        files: [
          {
            name: "some_file_name",
            link: "some_url",
            associatedLinks: [],
          },
          {
            name: "some_other_file_name",
            link: "some_url",
            associatedLinks: [],
          },
        ],
      },
    ];
    const search = /some_matching_file_name/;
    const result = filterGroupedFiles(groupedFiles, search);
    expect(result).toStrictEqual([
      {
        taskName: "some_task_name",
        files: [
          {
            name: "some_matching_file_name",
            link: "some_url",
            associatedLinks: [],
          },
        ],
      },
    ]);
  });
});
