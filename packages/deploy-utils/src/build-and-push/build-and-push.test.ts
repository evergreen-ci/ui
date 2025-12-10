import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { pushToS3 } from "../utils/s3";
import { buildAndPush } from ".";

vi.mock("child_process", () => ({
  execSync: vi.fn(),
}));

vi.mock("fs", () => ({
  writeFileSync: vi.fn(),
}));

vi.mock("../utils/s3", () => ({
  pushToS3: vi.fn(),
}));

describe("buildAndPush", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls pushToS3 function when BUCKET is defined", () => {
    vi.mocked(execSync).mockImplementationOnce(vi.fn());
    vi.mocked(execSync).mockReturnValueOnce("commitHash");
    buildAndPush("bucket-name");
    expect(vi.mocked(pushToS3)).toHaveBeenCalledOnce();
    expect(vi.mocked(pushToS3)).toHaveBeenCalledWith("bucket-name");
    expect(vi.mocked(writeFileSync)).toHaveBeenCalledOnce();
    expect(vi.mocked(writeFileSync)).toHaveBeenCalledWith(
      "dist/commit.txt",
      "commitHash",
    );
  });

  it("fails when pnpm build fails", () => {
    vi.mocked(execSync).mockImplementation(() => {
      throw Error("mock pnpm build error");
    });
    expect(() => buildAndPush("my-bucket")).toThrowError(
      "mock pnpm build error",
    );
    expect(vi.mocked(pushToS3)).not.toHaveBeenCalled();
  });
});
