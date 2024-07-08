import { getAppToDeploy } from "../utils/environment";
import * as shellUtils from "../utils/shell";
import { findExecutable, formatDate } from "./utils";

vi.mock("../utils/environment", async (importOriginal) => ({
  // @ts-expect-error
  ...(await importOriginal()),
  getAppToDeploy: vi.fn().mockReturnValue("spruce"),
}));

describe("formatDate", () => {
  it("correctly formats a date", () => {
    const d = new Date(2024, 1, 23);
    expect(formatDate(d)).toEqual("2024-01-23");
  });
});

describe("findExecutable", () => {
  it("finds an absolute path to the evergreen executable", async () => {
    expect(await findExecutable("evergreen")).toMatch(/^\/(.*)\/evergreen$/);
  });

  it("returns null for a nonexistent executable", async () => {
    expect(await findExecutable(`${Math.random()}`)).toBeNull();
  });
});

describe("makeEmail", async () => {
  const { makeEmail } = await import(".");
  const defaultArgs = {
    app: "spruce",
    commitToDeploy: "123",
    commitsString: "commit's a\ncommit b\n",
    previousTag: "spruce/v0.0.1",
  };

  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("errors if there is no bucket set", () => {
    expect(() => makeEmail(defaultArgs)).toThrowError(
      "DEPLOYS_EMAIL not configured",
    );
  });

  it("errors if there is no email set", () => {
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
    vi.useFakeTimers().setSystemTime(new Date(2020, 6, 22));
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
    vi.useFakeTimers().setSystemTime(new Date(2020, 6, 22));
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
    vi.useFakeTimers().setSystemTime(new Date(2020, 6, 22));
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
    vi.useFakeTimers().setSystemTime(new Date(2020, 6, 22));
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

const emailCommandRegex =
  /^\/(.*)\/evergreen (-c .evergreen.yml)? notify email -f sender@mongodb.com -r foo@mongodb.com -s '2020-06-22 Spruce Deploy to (.*)' -b '(.*)'/;

describe("sendEmail", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.doMock("fs");
    vi.stubEnv("CI", "true");
    vi.stubEnv("AUTHOR_EMAIL", "sender@mongodb.com");
    vi.stubEnv("DEPLOYS_EMAIL", "foo@mongodb.com");
    vi.mocked(getAppToDeploy).mockReturnValue("spruce");
    vi.useFakeTimers().setSystemTime(new Date(2020, 6, 22));
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
});
