import { readFileSync } from "fs";
import {
  checkIsAncestor,
  generateTypes,
  getLatestCommitFromRemote,
} from "./utils";
import { checkSchemaAndCodegenCore } from ".";

vi.mock("fs");
vi.mock("path", () => ({
  resolve: vi.fn().mockReturnValue("{path.resolve()}"),
}));
vi.mock("./utils.ts", () => ({
  canResolveDNS: vi.fn(),
  getLatestCommitFromRemote: vi.fn(),
  checkIsAncestor: vi.fn(),
  generateTypes: vi.fn(),
}));

describe("checkSchemaAndCodegen", () => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  let consoleErrorSpy;
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(readFileSync).mockReturnValue(Buffer.from("file-contents"));
    vi.mocked(checkIsAncestor).mockResolvedValue(true);
    vi.mocked(generateTypes).mockResolvedValue("./types.ts");
    vi.mocked(getLatestCommitFromRemote).mockResolvedValue(
      "{getLatestCommitFromRemote()}",
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 0 when offline", async () => {
    vi.mocked(getLatestCommitFromRemote).mockRejectedValueOnce(
      new Error("TypeError: fetch failed"),
    );
    await expect(checkSchemaAndCodegenCore()).resolves.toBe(0);
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "An error occured during GQL types validation: Error: TypeError: fetch failed",
    );
  });

  it("returns 1 when checkIsAncestor is false and the files are the same", async () => {
    vi.mocked(checkIsAncestor).mockResolvedValue(false);
    await expect(checkSchemaAndCodegenCore()).resolves.toBe(1);
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "GQL types validation failed: Your local Evergreen code is missing commit {getLatestCommitFromRemote()}. Pull Evergreen and run 'pnpm codegen'.",
    );
  });

  it("returns 1 when checkIsAncestor is false and the files are different", async () => {
    vi.mocked(checkIsAncestor).mockResolvedValue(false);
    vi.mocked(readFileSync)
      .mockReturnValueOnce(Buffer.from("content1"))
      .mockReturnValueOnce(Buffer.from("content2"));
    await expect(checkSchemaAndCodegenCore()).resolves.toBe(1);
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "GQL types validation failed: Your local Evergreen code is missing commit {getLatestCommitFromRemote()}. Pull Evergreen and run 'pnpm codegen'.",
    );
  });

  it("returns 0 when checkIsAncestor is true and the files are the same", async () => {
    await expect(checkSchemaAndCodegenCore()).resolves.toBe(0);
  });

  it("returns 1 when checkIsAncestor returns true and the files are different", async () => {
    vi.mocked(readFileSync)
      .mockReturnValueOnce(Buffer.from("content1"))
      .mockReturnValueOnce(Buffer.from("content2"));
    await expect(checkSchemaAndCodegenCore()).resolves.toBe(1);
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "GQL types validation failed: Your GQL types file ({path.resolve()}) is outdated. Run 'pnpm codegen'.",
    );
  });
});
