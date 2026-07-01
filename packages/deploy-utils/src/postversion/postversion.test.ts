import { execSync } from "child_process";
import { getAppToDeploy } from "../utils/environment";
import { push, pushTags } from "../utils/git";
import { countdownTimer } from "../utils/shell";
import { postversion } from ".";

vi.mock("child_process", () => ({
  execSync: vi.fn(),
}));

vi.mock("../utils/environment", () => ({
  getAppToDeploy: vi.fn(),
}));

vi.mock("../utils/git", () => ({
  push: vi.fn(),
  pushTags: vi.fn(),
}));

vi.mock("../utils/shell", () => ({
  countdownTimer: vi.fn(),
}));

describe("postversion", () => {
  beforeEach(() => {
    vi.mocked(getAppToDeploy).mockReturnValue("spruce");
    vi.stubEnv("npm_package_version", "1.2.3");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  it("creates the version commit without running git hooks", async () => {
    vi.spyOn(console, "log").mockImplementation(vi.fn());
    await postversion();
    expect(vi.mocked(execSync)).toHaveBeenCalledWith(
      'git commit --no-verify -m "spruce/v1.2.3"',
      { stdio: "inherit", encoding: "utf-8" },
    );
  });

  it("stages, commits, tags, and pushes in order", async () => {
    vi.spyOn(console, "log").mockImplementation(vi.fn());
    await postversion();
    expect(vi.mocked(execSync)).toHaveBeenNthCalledWith(
      1,
      "git add package.json",
      { stdio: "inherit", encoding: "utf-8" },
    );
    expect(vi.mocked(execSync)).toHaveBeenNthCalledWith(
      2,
      'git commit --no-verify -m "spruce/v1.2.3"',
      { stdio: "inherit", encoding: "utf-8" },
    );
    expect(vi.mocked(execSync)).toHaveBeenNthCalledWith(
      3,
      'git tag -a "spruce/v1.2.3" -m "spruce/v1.2.3"',
      { stdio: "inherit", encoding: "utf-8" },
    );
    expect(vi.mocked(push)).toHaveBeenCalledOnce();
    expect(vi.mocked(pushTags)).toHaveBeenCalledOnce();
  });

  it("halts the deploy when the commit fails", async () => {
    vi.spyOn(console, "log").mockImplementation(vi.fn());
    vi.mocked(execSync).mockImplementation((command) => {
      if (typeof command === "string" && command.startsWith("git commit")) {
        throw Error("pre-commit hook failed");
      }
      return "";
    });
    await expect(postversion()).rejects.toThrow("pre-commit hook failed");
    expect(vi.mocked(push)).not.toHaveBeenCalled();
    expect(vi.mocked(pushTags)).not.toHaveBeenCalled();
    expect(vi.mocked(countdownTimer)).not.toHaveBeenCalled();
  });
});
