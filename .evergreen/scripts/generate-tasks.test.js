import { describe, test, expect, vi } from "vitest";
import { targetsFromChangedFiles } from "./generate-tasks.js";
import { APPS_DIR, IGNORED_FILE_EXTENSIONS } from "./constants.js";

vi.mock("./constants.js", () => ({
  APPS_DIR: "apps",
  IGNORED_FILE_EXTENSIONS: new Set([".md", ".txt"]),
  TASK_MAPPING: {
    spruce: ["task1", "task2"],
    parsley: ["task3", "task4"],
  },
}));

describe("targetsFromChangedFiles", () => {
  test("should not add spruce to targets when only parsley files are changed", () => {
    const files = ["apps/parsley/src/file1.js", "apps/parsley/src/file2.js"];
    const targets = targetsFromChangedFiles(files);
    
    expect(targets).toContain("parsley");
    expect(targets).not.toContain("spruce");
  });

  test("should add spruce to targets when spruce files are changed", () => {
    const files = ["apps/spruce/src/file1.js", "apps/spruce/src/file2.js"];
    const targets = targetsFromChangedFiles(files);
    
    expect(targets).toContain("spruce");
  });

  test("should add both spruce and parsley to targets when shared files are changed", () => {
    const files = ["packages/lib/src/file1.js", "config/file2.js"];
    const targets = targetsFromChangedFiles(files);
    
    expect(targets).toContain("spruce");
    expect(targets).toContain("parsley");
  });

  test("should add spruce to targets when both spruce and parsley files are changed", () => {
    const files = [
      "apps/spruce/src/file1.js",
      "apps/parsley/src/file2.js",
    ];
    const targets = targetsFromChangedFiles(files);
    
    expect(targets).toContain("spruce");
    expect(targets).toContain("parsley");
  });

  test("should ignore files with extensions in IGNORED_FILE_EXTENSIONS", () => {
    const files = ["apps/parsley/src/file1.md", "apps/parsley/src/file2.txt"];
    const targets = targetsFromChangedFiles(files);
    
    expect(targets).toEqual([]);
  });

  test("should handle mixed scenarios correctly", () => {
    const files = [
      "apps/parsley/src/file1.js", // Parsley-specific
      "packages/lib/src/file2.js", // Shared
      "apps/spruce/src/file3.md",  // Ignored extension
    ];
    const targets = targetsFromChangedFiles(files);
    
    expect(targets).toContain("spruce");
    expect(targets).toContain("parsley");
  });
});
