import { mockEnvironmentVariables } from "@evg-ui/lib/test_utils/utils";
import { execSync } from "child_process";
import { buildAndPush } from ".";
import { pushToS3 } from "../utils/s3";

const { cleanup, mockEnv } = mockEnvironmentVariables();

vi.mock("child_process", () => ({
  execSync: vi.fn(),
}));

vi.mock("../utils/s3", () => ({
  pushToS3: vi.fn(),
}));

describe("remote deploys", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("fails when no bucket env var exists", () => {
    expect(() => buildAndPush("staging")).toThrowError("No bucket specified");
    expect(vi.mocked(pushToS3)).not.toHaveBeenCalled();
  });

  it("calls pushToS3 function when BUCKET is defined", () => {
    mockEnv("BUCKET", "bucket-name");
    buildAndPush("staging");
    expect(vi.mocked(pushToS3)).toHaveBeenCalledOnce();
    expect(vi.mocked(pushToS3)).toHaveBeenCalledWith("bucket-name");
  });

  it("fails when yarn build fails", () => {
    vi.mocked(execSync).mockImplementation(() => {
      throw Error("mock yarn build error");
    });
    expect(() => buildAndPush("staging")).toThrowError("mock yarn build error");
    expect(vi.mocked(pushToS3)).not.toHaveBeenCalled();
  });
});
