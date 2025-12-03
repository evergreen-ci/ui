import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import { generateHTML } from "./generator.ts";
import analyticsVisualizer from "./index.ts";
import { scanAnalyticsDirectory } from "./parser.ts";

vi.mock("./parser.ts", () => ({
  scanAnalyticsDirectory: vi.fn(),
}));

vi.mock("./generator.ts", () => ({
  generateHTML: vi.fn(),
}));

vi.mock("fs", async () => {
  const actual = await vi.importActual<typeof import("fs")>("fs");
  return {
    ...actual,
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
  };
});

describe("analyticsVisualizer", () => {
  const mockOptions = {
    analyticsDir: "src/analytics",
    appName: "TestApp",
    honeycombBaseUrl: "https://honeycomb.io/test",
  };

  beforeEach(() => {
    vi.spyOn(process, "cwd").mockReturnValue("/test/project");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should not throw when scanAnalyticsDirectory fails", async () => {
    const plugin = analyticsVisualizer(mockOptions);
    const mockError = new Error("Failed to scan directory");

    vi.mocked(scanAnalyticsDirectory).mockImplementation(() => {
      throw mockError;
    });

    const writeBundle = plugin.writeBundle as (bundleOptions: {
      dir?: string;
      file?: string;
    }) => Promise<void>;

    // Should not throw - errors should be caught and logged
    await expect(writeBundle({ dir: "/test/dist" })).resolves.not.toThrow();

    // Should log the error
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("[analyticsVisualizer]"),
      expect.anything(),
    );
  });

  it("should not throw when generateHTML fails", async () => {
    const plugin = analyticsVisualizer(mockOptions);
    const mockError = new Error("Failed to generate HTML");

    vi.mocked(scanAnalyticsDirectory).mockReturnValue([]);
    vi.mocked(generateHTML).mockImplementation(() => {
      throw mockError;
    });

    const writeBundle = plugin.writeBundle as (bundleOptions: {
      dir?: string;
      file?: string;
    }) => Promise<void>;

    // Should not throw - errors should be caught and logged
    await expect(writeBundle({ dir: "/test/dist" })).resolves.not.toThrow();

    // Should log the error
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("[analyticsVisualizer]"),
      expect.anything(),
    );
  });

  it("should not throw when mkdirSync fails", async () => {
    const plugin = analyticsVisualizer(mockOptions);
    const mockError = new Error("Failed to create directory");

    vi.mocked(scanAnalyticsDirectory).mockReturnValue([]);
    vi.mocked(generateHTML).mockReturnValue("<html></html>");
    vi.mocked(fs.mkdirSync).mockImplementation(() => {
      throw mockError;
    });

    const writeBundle = plugin.writeBundle as (bundleOptions: {
      dir?: string;
      file?: string;
    }) => Promise<void>;

    // Should not throw - errors should be caught and logged
    await expect(writeBundle({ dir: "/test/dist" })).resolves.not.toThrow();

    // Should log the error
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("[analyticsVisualizer]"),
      expect.anything(),
    );
  });

  it("should not throw when writeFileSync fails", async () => {
    const plugin = analyticsVisualizer(mockOptions);
    const mockError = new Error("Failed to write file");

    vi.mocked(scanAnalyticsDirectory).mockReturnValue([]);
    vi.mocked(generateHTML).mockReturnValue("<html></html>");
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined);
    vi.mocked(fs.writeFileSync).mockImplementation(() => {
      throw mockError;
    });

    const writeBundle = plugin.writeBundle as (bundleOptions: {
      dir?: string;
      file?: string;
    }) => Promise<void>;

    // Should not throw - errors should be caught and logged
    await expect(writeBundle({ dir: "/test/dist" })).resolves.not.toThrow();

    // Should log the error
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("[analyticsVisualizer]"),
      expect.anything(),
    );
  });

  it("should not throw when analytics directory does not exist", async () => {
    const plugin = analyticsVisualizer({
      ...mockOptions,
      analyticsDir: "/nonexistent/directory",
    });

    vi.mocked(scanAnalyticsDirectory).mockImplementation(() => {
      throw new Error("ENOENT: no such file or directory");
    });

    const writeBundle = plugin.writeBundle as (bundleOptions: {
      dir?: string;
      file?: string;
    }) => Promise<void>;

    // Should not throw - errors should be caught and logged
    await expect(writeBundle({ dir: "/test/dist" })).resolves.not.toThrow();
  });

  it("should successfully generate visualization when everything works", async () => {
    const plugin = analyticsVisualizer(mockOptions);
    const mockData = [
      {
        identifier: "test-identifier",
        actions: [
          {
            name: "Test Action",
            properties: [],
          },
        ],
        filePath: "/test/analytics.ts",
      },
    ];

    vi.mocked(scanAnalyticsDirectory).mockReturnValue(mockData);
    vi.mocked(generateHTML).mockReturnValue("<html>Success</html>");
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined);
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined);

    const writeBundle = plugin.writeBundle as (bundleOptions: {
      dir?: string;
      file?: string;
    }) => Promise<void>;

    await expect(writeBundle({ dir: "/test/dist" })).resolves.not.toThrow();

    expect(scanAnalyticsDirectory).toHaveBeenCalled();
    expect(generateHTML).toHaveBeenCalledWith(mockData, expect.any(Object));
    expect(fs.mkdirSync).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });
});
