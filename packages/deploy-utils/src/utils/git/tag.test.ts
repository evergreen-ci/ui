import { execSync } from "child_process";
import process from "process";
import { getAppToDeploy } from "../environment";
import { countdownTimer, execTrim, green, underline } from "../shell";
import {
  createTagAndPush,
  getLatestTag,
  getReleaseVersion,
  ReleaseVersion,
  tagIsValid,
} from ".";
import * as gitIndex from "./index";

vi.mock("child_process", () => ({
  execSync: vi.fn(),
}));
vi.mock("../shell", async () => {
  const actual = await vi.importActual("../shell");
  return {
    ...actual,
    execTrim: vi.fn().mockReturnValue(""), // Mock execTrim with default return value
    countdownTimer: vi.fn(),
    green: vi.fn(),
    underline: vi.fn(),
  };
});
vi.mock("../environment", async () => {
  const actual = await vi.importActual("../environment");
  return {
    ...actual,
    getAppToDeploy: vi.fn(),
  };
});
// Don't mock ./index - import actual functions and spy on them

describe("tagIsValid", () => {
  it("should match on a known valid tag", () => {
    expect(tagIsValid("parsley", "parsley/v1.2.3")).toEqual(true);
  });

  it("should not match on the wrong app's tag", () => {
    expect(tagIsValid("parsley", "spruce/v1.2.3")).toEqual(false);
  });
});

describe("getLatestTag", () => {
  it("should return the latest spruce tag", () => {
    // execTrim is mocked at module level, override for this test
    vi.mocked(execTrim).mockImplementationOnce(() => "spruce/v6.1.15");
    const app = "spruce";
    const latestTag = getLatestTag(app);
    expect(tagIsValid(app, latestTag)).toEqual(true);
    expect(execTrim).toHaveBeenCalledWith(
      'git describe --tags --abbrev=0 --match="spruce/*" ',
    );
  });

  it("should return the latest parsley tag", () => {
    vi.mocked(execTrim).mockImplementationOnce(() => "parsley/v3.1.8");
    const app = "parsley";
    const latestTag = getLatestTag(app);
    expect(tagIsValid(app, latestTag)).toEqual(true);
    expect(execTrim).toHaveBeenCalledWith(
      'git describe --tags --abbrev=0 --match="parsley/*" ',
    );
  });
});

describe("getReleaseVersion", () => {
  it("major has precedence over minor and patch", () => {
    const commitMessages = `
    DEVPROD-10186: Add waterfall active version labels [minor] (#399)
    DEVPROD-828: Add multisort to TaskDurationTable [major] (#406)
    DEVPROD-9268: Remove secrets from .env-cmdrc.json [minor] (#391)
    704ef79b DEVPROD-7340 Move ConditionalWrapper to lib and setup vitest for jsdom testing in lib (#398)
    `;
    const releaseVersion = getReleaseVersion(commitMessages);
    expect(releaseVersion).toEqual("major");
  });
  it("minor has precedence over patch", () => {
    const commitMessages = `
    DEVPROD-10186: Add waterfall active version labels [minor] (#399)
    DEVPROD-828: Add multisort to TaskDurationTable (#406)
    DEVPROD-9268: Remove secrets from .env-cmdrc.json [minor] (#391)
    704ef79b DEVPROD-7340 Move ConditionalWrapper to lib and setup vitest for jsdom testing in lib (#398)
    `;
    const releaseVersion = getReleaseVersion(commitMessages);
    expect(releaseVersion).toEqual("minor");
  });
  it("patch is the default value when no version label exists", () => {
    const commitMessages = `
    DEVPROD-10186: Add waterfall active version labels (#399)
    DEVPROD-828: Add multisort to TaskDurationTable (#406)
    DEVPROD-9268: Remove secrets from .env-cmdrc.json (#391)
    704ef79b DEVPROD-7340 Move ConditionalWrapper to lib and setup vitest for jsdom testing in lib (#398)
    `;
    const releaseVersion = getReleaseVersion(commitMessages);
    expect(releaseVersion).toEqual("patch");
  });
});

describe("createTagAndPush", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(vi.fn());
    vi.mocked(green).mockImplementation((text) => `\x1b[32m${text}\x1b[0m`);
    vi.mocked(underline).mockImplementation((text) => `\x1b[4m${text}\x1b[0m`);
    vi.mocked(getAppToDeploy).mockReturnValue("spruce");
    vi.mocked(countdownTimer).mockResolvedValue(undefined);
    vi.spyOn(gitIndex, "push").mockImplementation(() => {});
    vi.spyOn(process, "cwd").mockReturnValue("/path/to/app");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call yarn version with patch when version is patch", async () => {
    vi.mocked(execSync).mockReturnValueOnce(Buffer.from("")); // yarn version
    vi.mocked(execTrim).mockReturnValue("6.1.16");

    await createTagAndPush(ReleaseVersion.Patch);

    expect(execSync).toHaveBeenCalledWith("yarn version --new-version patch", {
      encoding: "utf-8",
      stdio: "inherit",
    });
    expect(consoleLogSpy).toHaveBeenCalledWith("Creating new tag...");
  });

  it("should call yarn version with minor when version is minor", async () => {
    vi.mocked(execSync).mockReturnValueOnce(Buffer.from("")); // yarn version
    vi.mocked(execTrim).mockReturnValue("6.2.0");

    await createTagAndPush(ReleaseVersion.Minor);

    expect(execSync).toHaveBeenCalledWith("yarn version --new-version minor", {
      encoding: "utf-8",
      stdio: "inherit",
    });
  });

  it("should call yarn version with major when version is major", async () => {
    vi.mocked(execSync).mockReturnValueOnce(Buffer.from("")); // yarn version
    vi.mocked(execTrim).mockReturnValue("7.0.0");

    await createTagAndPush(ReleaseVersion.Major);

    expect(execSync).toHaveBeenCalledWith("yarn version --new-version major", {
      encoding: "utf-8",
      stdio: "inherit",
    });
  });

  it("should log success messages after pushing", async () => {
    vi.mocked(execSync).mockReturnValueOnce(Buffer.from("")); // yarn version
    vi.mocked(execTrim).mockReturnValue("6.1.16");

    await createTagAndPush(ReleaseVersion.Patch);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Pushed to remote. Should be deploying soon...",
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Track deploy progress at"),
    );
  });

  it("should throw error when yarn version command fails", async () => {
    const error = new Error("yarn version failed");
    vi.mocked(execSync).mockImplementation(() => {
      throw error;
    });

    await expect(() => createTagAndPush(ReleaseVersion.Patch)).toThrow(
      "Creating new tag failed.",
    );
    expect(consoleLogSpy).toHaveBeenCalledWith("Creating new tag...");
    expect(consoleLogSpy).not.toHaveBeenCalledWith(
      "Pushed to remote. Should be deploying soon...",
    );
  });
});
