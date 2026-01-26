import Stream from "stream";
import { tagIsValid } from ".";

describe("getCurrentDeployedCommit without mocking https requests", () => {
  it("fetches the commit from spruce", async () => {
    const { getCurrentlyDeployedCommit } =
      await import("./get-current-deployed-commit");
    expect(await getCurrentlyDeployedCommit("spruce")).toHaveLength(40);
  });

  it("fetches the commit from parsley", async () => {
    const { getCurrentlyDeployedCommit } =
      await import("./get-current-deployed-commit");
    expect(await getCurrentlyDeployedCommit("parsley")).toHaveLength(40);
  });
});

describe("when get request fails", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock("https", () => ({
      default: vi.fn(),
      get: vi.fn().mockImplementation((_, cb) => {
        const s = new Stream();
        cb(s);
        s.emit("error", new Error("invalid"));
      }),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.doUnmock("https");
  });

  it("gets a local spruce tag", async () => {
    const { getCurrentlyDeployedCommit } =
      await import("./get-current-deployed-commit");
    const app = "spruce";
    const commit = await getCurrentlyDeployedCommit(app);
    expect(commit).not.toHaveLength(40);
    expect(tagIsValid(app, commit)).toBe(true);
  });

  it("gets a local parsley tag", async () => {
    const { getCurrentlyDeployedCommit } =
      await import("./get-current-deployed-commit");
    const app = "parsley";
    const commit = await getCurrentlyDeployedCommit(app);
    expect(commit).not.toHaveLength(40);
    expect(tagIsValid(app, commit)).toBe(true);
  });
});
