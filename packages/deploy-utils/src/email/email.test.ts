import { getAppToDeploy } from "../utils/environment";
import * as shellUtils from "../utils/shell";
import { findEvergreen, formatDate } from "./utils";
import { makeEmail } from ".";

vi.mock("../utils/environment", async (importOriginal) => ({
  // @ts-expect-error: Not necessary to mock entire object for test.
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
    expect(evgConfig?.evgExecutable).toMatch(/^(evergreen|~\/evergreen)$/);
  });
});

describe("makeEmail", async () => {
  const defaultArgs = {
    app: "spruce",
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
    expect(() => makeEmail(defaultArgs)).toThrowError(
      "DEPLOYS_EMAIL not configured",
    );
  });

  it("errors if there is no author set", () => {
    vi.stubEnv("DEPLOYS_EMAIL", "foo@mongodb.com");
    vi.spyOn(shellUtils, "execTrim").mockReturnValue("");
    expect(() => makeEmail(defaultArgs)).toThrowError(
      "Author email not configured",
    );
  });

  it("returns email fields with single quotes replaced", () => {
    vi.stubEnv("CI", "true");
    vi.stubEnv("DEPLOYS_EMAIL", "foo@mongodb.com");
    vi.stubEnv("AUTHOR_EMAIL", "sender@mongodb.com");
    vi.useFakeTimers().setSystemTime(new Date("2020-06-22"));
    expect(makeEmail(defaultArgs)).toStrictEqual({
      body: "<ul><li>commit‘s a</li><li>commit b</li></ul><p><b>To revert, rerun task from previous release tag (spruce/v0.0.1)</b></p>",
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
      body: "<ul><li>commit‘s a</li><li>commit b</li></ul><p><b>To revert, rerun task from previous release tag (spruce/v0.0.1)</b></p>",
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
      body: "<ul><li>commit‘s a</li><li>commit b</li></ul>",
      from: "sender@mongodb.com",
      recipients: "foo@mongodb.com",
      subject: "2020-06-22 Spruce Deploy to 123",
    });
  });
});

describe("sendEmail", () => {
  const emailCommandRegex =
    /^(evergreen|(~\/evergreen -c .evergreen.yml))(\s+)notify email -f sender@mongodb.com -r foo@mongodb.com -s '2020-06-22 Spruce Deploy to (spruce\/v\d+.\d+.\d+|[0-9a-f]{7})' -b '<ul>(<li>(.*)<\/li>)*<\/ul><p><b>To revert, rerun task from previous release tag \(spruce\/v\d+.\d+.\d+\)<\/b><\/p>'$/;

  const revertEmailRegex =
    /^(evergreen|~\/evergreen)( -c .evergreen.yml)?(\s+)notify email -f sender@mongodb.com -r foo@mongodb.com -s '2020-06-22 Spruce Deploy to (spruce\/v\d+.\d+.\d+|[0-9a-f]{7}) \(Revert\)' -b '<ul>(<li>(.*)<\/li>)*<\/ul>'$/;

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

  describe("validate regexes", () => {
    it("matches on a non-revert email", () => {
      const emailCmd = `evergreen notify email -f sender@mongodb.com -r foo@mongodb.com -s '2020-06-22 Spruce Deploy to 1234567' -b '<ul><li>123abc commit message</li></ul><p><b>To revert, rerun task from previous release tag (spruce/v0.1.2)</b></p>'`;
      expect(emailCmd).toEqual(expect.stringMatching(emailCommandRegex));
    });

    it("matches on a revert email", () => {
      const emailCmd = `~/evergreen -c .evergreen.yml notify email -f sender@mongodb.com -r foo@mongodb.com -s '2020-06-22 Spruce Deploy to 1234567 (Revert)' -b '<ul><li>123abc commit message</li></ul>'`;
      expect(emailCmd).toEqual(expect.stringMatching(revertEmailRegex));
    });
  });

  it("uses previous deploy file", async () => {
    const { readFileSync } = await import("fs");
    const { sendEmail } = await import("./index");
    const consoleSpy = vi.spyOn(console, "log");
    vi.mocked(readFileSync).mockReturnValue("HEAD");
    await sendEmail();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(emailCommandRegex),
    );
    expect(vi.mocked(readFileSync)).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
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
    expect(vi.mocked(readFileSync)).toThrowError("file not found");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(emailCommandRegex),
    );
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
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(revertEmailRegex),
    );
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
