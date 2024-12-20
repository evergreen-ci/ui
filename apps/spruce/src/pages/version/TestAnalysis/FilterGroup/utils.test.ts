import { TaskBuildVariantField } from "../types";
import { getAllBuildVariants } from "./utils";

describe("getAllBuildVariants", () => {
  it("should return an empty array when the map is empty", () => {
    const taskMap = new Map<string, TaskBuildVariantField[]>();

    const result = getAllBuildVariants(taskMap);
    expect(result).toEqual([]);
  });

  it("should return a list of unique build variants", () => {
    const taskMap = new Map<string, TaskBuildVariantField[]>([
      [
        "test1",
        [
          {
            taskName: "task1",
            buildVariant: "variant1",
            buildVariantDisplayName: "Variant 1",
            id: "id1",
            displayStatus: "passed",
            logs: {
              urlParsley: "",
            },
          },
          {
            taskName: "task2",
            buildVariant: "variant2",
            buildVariantDisplayName: "Variant 2",
            id: "id2",
            displayStatus: "failed",
            logs: {
              urlParsley: "",
            },
          },
        ],
      ],
      [
        "test2",
        [
          {
            taskName: "task3",
            buildVariant: "variant1",
            buildVariantDisplayName: "Variant 1",
            id: "id3",
            displayStatus: "passed",
            logs: {
              urlParsley: "",
            },
          },
          {
            taskName: "task4",
            buildVariant: "variant3",
            buildVariantDisplayName: "Variant 3",
            id: "id4",
            displayStatus: "failed",
            logs: {
              urlParsley: "",
            },
          },
        ],
      ],
    ]);

    const result = getAllBuildVariants(taskMap);
    expect(result).toEqual([
      { buildVariant: "variant1", buildVariantDisplayName: "Variant 1" },
      { buildVariant: "variant2", buildVariantDisplayName: "Variant 2" },
      { buildVariant: "variant3", buildVariantDisplayName: "Variant 3" },
    ]);
  });

  it("should handle tasks with duplicate build variants", () => {
    const taskMap = new Map<string, TaskBuildVariantField[]>([
      [
        "test1",
        [
          {
            taskName: "task1",
            buildVariant: "variant1",
            buildVariantDisplayName: "Variant 1",
            id: "id1",
            displayStatus: "passed",
            logs: {
              urlParsley: "",
            },
          },
          {
            taskName: "task2",
            buildVariant: "variant1",
            buildVariantDisplayName: "Variant 1",
            id: "id2",
            displayStatus: "failed",
            logs: {
              urlParsley: "",
            },
          },
        ],
      ],
      [
        "test2",
        [
          {
            taskName: "task3",
            buildVariant: "variant2",
            buildVariantDisplayName: "Variant 2",
            id: "id3",
            displayStatus: "passed",
            logs: {
              urlParsley: "",
            },
          },
        ],
      ],
    ]);

    const result = getAllBuildVariants(taskMap);
    expect(result).toEqual([
      { buildVariant: "variant1", buildVariantDisplayName: "Variant 1" },
      { buildVariant: "variant2", buildVariantDisplayName: "Variant 2" },
    ]);
  });

  it("should return unique build variants from tasks with different build variants", () => {
    const taskMap = new Map<string, TaskBuildVariantField[]>([
      [
        "test1",
        [
          {
            taskName: "task1",
            buildVariant: "variant1",
            buildVariantDisplayName: "Variant 1",
            id: "id1",
            displayStatus: "passed",
            logs: {
              urlParsley: "",
            },
          },
          {
            taskName: "task2",
            buildVariant: "variant2",
            buildVariantDisplayName: "Variant 2",
            id: "id2",
            displayStatus: "failed",
            logs: { urlParsley: "" },
          },
        ],
      ],
      [
        "test2",
        [
          {
            taskName: "task3",
            buildVariant: "variant3",
            buildVariantDisplayName: "Variant 3",
            id: "id3",
            displayStatus: "passed",
            logs: { urlParsley: "" },
          },
          {
            taskName: "task4",
            buildVariant: "variant4",
            buildVariantDisplayName: "Variant 4",
            id: "id4",
            displayStatus: "failed",
            logs: { urlParsley: "" },
          },
        ],
      ],
    ]);

    const result = getAllBuildVariants(taskMap);
    expect(result).toEqual([
      {
        buildVariant: "variant1",
        buildVariantDisplayName: "Variant 1",
      },
      {
        buildVariant: "variant2",
        buildVariantDisplayName: "Variant 2",
      },
      {
        buildVariant: "variant3",
        buildVariantDisplayName: "Variant 3",
      },
      {
        buildVariant: "variant4",
        buildVariantDisplayName: "Variant 4",
      },
    ]);
  });

  it("should return build variants even if there are no tasks", () => {
    const taskMap = new Map<string, TaskBuildVariantField[]>([
      ["test1", []],
      ["test2", []],
    ]);

    const result = getAllBuildVariants(taskMap);
    expect(result).toEqual([]);
  });
});
