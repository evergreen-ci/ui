import { Mocked } from "vitest";
import { execSync } from "child_process";
import { get } from "https";
import Stream from "stream";
import {
  getCurrentlyDeployedCommit,
  getRemotePreviousCommit,
} from "./get-current-deployed-commit";

const validCommitString = "0000000000000000000011111111111111111111";

// The return typing expected for these mocks does not align with the Node docs, so ignore these errors.
// @ts-expect-error - See comment above.
const successMock: Mocked<typeof get> = (_, cb) => {
  const s = new Stream();
  // @ts-expect-error - See comment above.
  cb(s);
  s.emit("data", new Array(21).join("0"));
  s.emit("data", new Array(21).join("1"));
  s.emit("end");
};

// @ts-expect-error - See comment above.
const errorMock: Mocked<typeof get> = (_, cb) => {
  const s = new Stream();
  // @ts-expect-error - See comment above.
  cb(s);
  s.emit("error", new Error("invalid"));
};

vi.mock("child_process", () => ({
  execSync: vi.fn(),
}));

vi.mock("https", () => ({
  default: vi.fn(),
  get: vi.fn(),
}));

describe("getRemotePreviousCommit", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches the commit", async () => {
    vi.mocked(get).mockImplementation(successMock);
    const resp = await getRemotePreviousCommit("spruce");
    expect(resp).toBe(validCommitString);
  });

  it("handles a rejection", async () => {
    vi.mocked(get).mockImplementation(errorMock);

    await expect(async () =>
      getRemotePreviousCommit("spruce"),
    ).rejects.toThrowError("invalid");
  });
});

describe("getCurrentlyDeployedCommit", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns valid remote commit", async () => {
    vi.mocked(get).mockImplementation(successMock);
    expect(await getCurrentlyDeployedCommit("spruce")).toEqual(
      validCommitString,
    );
  });

  it("returns a valid local commit", async () => {
    vi.mocked(get).mockImplementation(errorMock);
    vi.mocked(execSync).mockReturnValue("spruce/v1.0.0");
    expect(await getCurrentlyDeployedCommit("spruce")).toEqual("spruce/v1.0.0");
    expect(vi.mocked(execSync)).toHaveBeenCalledOnce();
  });

  it("errors with invalid remote and local commits", async () => {
    vi.mocked(get).mockImplementation(errorMock);
    await expect(async () =>
      getCurrentlyDeployedCommit("spruce"),
    ).rejects.toThrowError("No valid commit found");
  });
});
