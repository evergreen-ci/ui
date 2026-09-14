import { getAppToDeploy } from "../utils/environment";
import * as shellUtils from "../utils/shell";
import { DeployableApp } from "../utils/types";
import { findEvergreen, formatDate } from "./utils";
import { makeEmail } from ".";

vi.mock("child_process", async (importOriginal) => ({
  ...(await importOriginal()),
  execFileSync: vi.fn(),
}));

vi.mock("../utils/environment", async (importOriginal) => ({
  ...(await importOriginal()),
  getAppToDeploy: vi.fn().mockReturnValue("spruce"),
}));

describe("formatDate", () => {
  it("correctly formats a date", () => {
    const d = new Date("2024-01-23");
    expect(formatDate(d)).toEqual("2024-01-23");
  });
});

describe("findEvergreen", () => {
  it("finds the evergreen executable", () => {
    const evgConfig = findEvergreen();
    expect(evgConfig).not.toBe(null);
    expect(evgConfig?.evgExecutable).toMatch(/^(evergreen|.*\/evergreen)$/);
  });
});

describe("makeEmail", async () => {
  const defaultArgs = {
    app: "spruce" as DeployableApp,
    commitToDeploy: "123",
    commitsString: "commit's a\ncommit b\n",
    isRevert: false,
    previousTag: "spruce/v0.0.1",
  };

  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("errors if there is no deploys email set", () => {
    expect(() => makeEmail(defaultArgs)).toThrow(
      "DEPLOYS_EMAIL not configured",
    );
  });

  it("errors if there is no author set", () => {
    vi.stubEnv("DEPLOYS_EMAIL", "foo@mongodb.com");
    vi.spyOn(shellUtils, "execTrim").mockReturnValue("");
    expect(() => makeEmail(defaultArgs)).toThrow("Author email not configured");
  });

  it("returns email fields with HTML escaped content", () => {
    vi.stubEnv("CI", "true");
    vi.stubEnv("DEPLOYS_EMAIL", "foo@mongodb.com");
    vi.stubEnv("AUTHOR_EMAIL", "sender@mongodb.com");
    vi.useFakeTimers().setSystemTime(new Date("2020-06-22"));
    expect(makeEmail(defaultArgs)).toStrictEqual({
      body: "<ul><li>commit&#039;s a</li><li>commit b</li></ul><p><b>To revert, rerun task from previous release tag (spruce/v0.0.1)</b></p>",
      from: "sender@mongodb.com",
      recipients: "foo@mongodb.com",
      subject: "2020-06-22 Spruce Deploy to 123",
    });
  });

  it("escapes HTML in commit messages and previous tags", () => {
    vi.stubEnv("CI", "true");
    vi.stubEnv("DEPLOYS_EMAIL", "foo@mongodb.com");
    vi.stubEnv("AUTHOR_EMAIL", "sender@mongodb.com");
    vi.useFakeTimers().setSystemTime(new Date("2020-06-22"));

    expect(
      makeEmail({
        ...defaultArgs,
        commitsString: '<img src="x" onerror="alert(1)"> & commit',
        previousTag: 'spruce/v0.0.1"><img src="x" onerror="alert(1)">',
      }),
    ).toStrictEqual({
      body: "<ul><li>&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt; &amp; commit</li></ul><p><b>To revert, rerun task from previous release tag (spruce/v0.0.1&quot;&gt;&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;)</b></p>",
      from: "sender@mongodb.com",
      recipients: "foo@mongodb.com",
      subject: "2020-06-22 Spruce Deploy to 123",
    });
  });

  it("uses git email when not running on CI", () => {
    vi.stubEnv("CI", "false");
    vi.stubEnv("DEPLOYS_EMAIL", "foo@mongodb.com");
    vi.stubEnv("AUTHOR_EMAIL", "sender@mongodb.com");
    vi.spyOn(shellUtils, "execTrim").mockReturnValue("git.email@mongodb.com");
    vi.useFakeTimers().setSystemTime(new Date("2020-06-22"));
    expect(makeEmail(defaultArgs)).toStrictEqual({
      body: "<ul><li>commit&#039;s a</li><li>commit b</li></ul><p><b>To revert, rerun task from previous release tag (spruce/v0.0.1)</b></p>",
      from: "git.email@mongodb.com",
      recipients: "foo@mongodb.com",
      subject: "2020-06-22 Spruce Deploy to 123",
    });
  });

  it("linkifies commits when a hash is provided", () => {
    vi.stubEnv("CI", "true");
    vi.stubEnv("DEPLOYS_EMAIL", "foo@mongodb.com");
    vi.stubEnv("AUTHOR_EMAIL", "sender@mongodb.com");
    vi.useFakeTimers().setSystemTime(new Date("2020-06-22"));
    expect(
      makeEmail({
        ...defaultArgs,
        commitsString: "abcdefg commit a\n1234567 commit b",
      }),
    ).toStrictEqual({
      body: '<ul><li><a href="https://github.com/evergreen-ci/ui/commit/abcdefg">abcdefg commit a</a></li><li><a href="https://github.com/evergreen-ci/ui/commit/1234567">1234567 commit b</a></li></ul><p><b>To revert, rerun task from previous release tag (spruce/v0.0.1)</b></p>',
      from: "sender@mongodb.com",
      recipients: "foo@mongodb.com",
      subject: "2020-06-22 Spruce Deploy to 123",
    });
  });

  it("omits revert instructions during a revert", () => {
    vi.stubEnv("CI", "true");
    vi.stubEnv("DEPLOYS_EMAIL", "foo@mongodb.com");
    vi.stubEnv("AUTHOR_EMAIL", "sender@mongodb.com");
    vi.useFakeTimers().setSystemTime(new Date("2020-06-22"));
    expect(
      makeEmail({
        ...defaultArgs,
        previousTag: undefined,
      }),
    ).toStrictEqual({
      body: "<ul><li>commit&#039;s a</li><li>commit b</li></ul>",
      from: "sender@mongodb.com",
      recipients: "foo@mongodb.com",
      subject: "2020-06-22 Spruce Deploy to 123",
    });
  });
});

describe("sendEmail", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.doMock("fs");
    vi.stubEnv("CI", "true");
    vi.stubEnv("AUTHOR_EMAIL", "sender@mongodb.com");
    vi.stubEnv("DEPLOYS_EMAIL", "foo@mongodb.com");
    vi.stubEnv("EXECUTION", "0");
    vi.mocked(getAppToDeploy).mockReturnValue("spruce");
    vi.useFakeTimers().setSystemTime(new Date("2020-06-22"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("uses previous deploy file", async () => {
    const { readFileSync } = await import("fs");
    const { sendEmail } = await import("./index");
    const consoleSpy = vi.spyOn(console, "log");
    vi.mocked(readFileSync).mockReturnValue("HEAD");
    await sendEmail();
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const [executable, emailArgs] = consoleSpy.mock.calls[0] as [
      string,
      string[],
    ];
    expect(executable).toMatch(/^(evergreen|.*\/evergreen)$/);
    expect(emailArgs.slice(emailArgs.indexOf("notify"))).toEqual([
      "notify",
      "email",
      "-f",
      "sender@mongodb.com",
      "-r",
      "foo@mongodb.com",
      "-s",
      expect.stringMatching(/^2020-06-22 Spruce Deploy to /),
      "-b",
      expect.stringMatching(
        /^<ul>.*<\/ul><p><b>To revert, rerun task from previous release tag \(.*\)<\/b><\/p>$/,
      ),
    ]);
    expect(vi.mocked(readFileSync)).toHaveBeenCalledTimes(1);
  });

  it("uses local recent commit", async () => {
    const { readFileSync } = await import("fs");
    const { sendEmail } = await import("./index");
    const consoleSpy = vi.spyOn(console, "log");
    vi.mocked(readFileSync).mockImplementation(() => {
      throw Error("file not found");
    });
    await sendEmail();
    expect(vi.mocked(readFileSync)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(readFileSync)).toThrow("file not found");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const [executable, emailArgs] = consoleSpy.mock.calls[0] as [
      string,
      string[],
    ];
    expect(executable).toMatch(/^(evergreen|.*\/evergreen)$/);
    expect(emailArgs.slice(emailArgs.indexOf("notify"))).toEqual([
      "notify",
      "email",
      "-f",
      "sender@mongodb.com",
      "-r",
      "foo@mongodb.com",
      "-s",
      expect.stringMatching(/^2020-06-22 Spruce Deploy to /),
      "-b",
      expect.stringMatching(
        /^<ul>.*<\/ul><p><b>To revert, rerun task from previous release tag \(.*\)<\/b><\/p>$/,
      ),
    ]);
  });

  it("sends revert", async () => {
    const { readFileSync } = await import("fs");
    const { sendEmail } = await import("./index");
    const consoleSpy = vi.spyOn(console, "log");
    vi.stubEnv("EXECUTION", "1");
    vi.mocked(readFileSync).mockImplementation(() => {
      throw Error("file not found");
    });
    await sendEmail();
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const [executable, emailArgs] = consoleSpy.mock.calls[0] as [
      string,
      string[],
    ];
    expect(executable).toMatch(/^(evergreen|.*\/evergreen)$/);
    expect(emailArgs.slice(emailArgs.indexOf("notify"))).toEqual([
      "notify",
      "email",
      "-f",
      "sender@mongodb.com",
      "-r",
      "foo@mongodb.com",
      "-s",
      expect.stringMatching(/^2020-06-22 Spruce Deploy to .* \(Revert\)$/),
      "-b",
      expect.stringMatching(/^<ul>.*<\/ul>$/),
    ]);
  });

  it("passes email values as separate command arguments", async () => {
    vi.doMock("../utils/environment", () => ({
      getAppToDeploy: vi.fn(),
      isRunningOnCI: vi.fn(),
      isTest: false,
    }));
    vi.resetModules();
    const { execFileSync } = await import("child_process");
    const { evergreenNotify } = await import("./index");
    const body = "body with ' && touch /tmp/pwned";
    const subject = "subject with ' and spaces";
    const evgConfig = findEvergreen();

    expect(evgConfig).not.toBeNull();
    await evergreenNotify({
      body,
      from: "sender@mongodb.com",
      recipients: "foo@mongodb.com",
      subject,
    });

    expect(vi.mocked(execFileSync)).toHaveBeenCalledWith(
      evgConfig?.evgExecutable,
      [
        ...(evgConfig?.credentials ?? []),
        "notify",
        "email",
        "-f",
        "sender@mongodb.com",
        "-r",
        "foo@mongodb.com",
        "-s",
        subject,
        "-b",
        body,
      ],
    );
  });
});
