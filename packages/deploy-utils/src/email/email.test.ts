import { readFileSync } from "fs";
import * as email from ".";
// import { getAppToDeploy } from "../utils/environment";
import * as shellUtils from "../utils/shell";
import { findExecutable, formatDate } from "./utils";

const { makeEmail, sendEmail } = email;

vi.mock("fs");
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

describe("makeEmail", () => {
  const defaultArgs = {
    app: "spruce",
    commitToDeploy: "123",
    commitsString: "commit a\ncommit b\n",
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
    vi.stubEnv("DEPLOYS_EMAIL", "evg-users@mongodb.com");
    vi.spyOn(shellUtils, "execTrim").mockReturnValue("");
    expect(() => makeEmail(defaultArgs)).toThrowError(
      "Author email not configured",
    );
  });

  it("returns email fields", () => {
    vi.stubEnv("CI", "true");
    vi.stubEnv("DEPLOYS_EMAIL", "evg-users@mongodb.com");
    vi.stubEnv("AUTHOR_EMAIL", "sender@mongodb.com");
    vi.useFakeTimers().setSystemTime(new Date(2020, 6, 22));
    expect(makeEmail(defaultArgs)).toStrictEqual({
      body: "<ol><li>commit a</li><li>commit b</li></ol><p><b>To revert, rerun task from previous release tag (spruce/v0.0.1)</b></p>",
      from: "sender@mongodb.com",
      recipients: "evg-users@mongodb.com",
      subject: "2020-06-22 Spruce Deploy to 123",
    });
  });

  it("uses git email when not running on CI", () => {
    vi.stubEnv("CI", "false");
    vi.stubEnv("DEPLOYS_EMAIL", "evg-users@mongodb.com");
    vi.stubEnv("AUTHOR_EMAIL", "sender@mongodb.com");
    vi.spyOn(shellUtils, "execTrim").mockReturnValue("git.email@mongodb.com");
    vi.useFakeTimers().setSystemTime(new Date(2020, 6, 22));
    expect(makeEmail(defaultArgs)).toStrictEqual({
      body: "<ol><li>commit a</li><li>commit b</li></ol><p><b>To revert, rerun task from previous release tag (spruce/v0.0.1)</b></p>",
      from: "git.email@mongodb.com",
      recipients: "evg-users@mongodb.com",
      subject: "2020-06-22 Spruce Deploy to 123",
    });
  });

  it("linkifies commits when a hash is provided", () => {
    vi.stubEnv("CI", "true");
    vi.stubEnv("DEPLOYS_EMAIL", "evg-users@mongodb.com");
    vi.stubEnv("AUTHOR_EMAIL", "sender@mongodb.com");
    vi.useFakeTimers().setSystemTime(new Date(2020, 6, 22));
    expect(
      makeEmail({
        ...defaultArgs,
        commitsString: "abcdefg commit a\n1234567 commit b",
      }),
    ).toStrictEqual({
      body: '<ol><li><a href="https://github.com/evergreen-ci/ui/commit/abcdefg">abcdefg commit a</a></li><li><a href="https://github.com/evergreen-ci/ui/commit/1234567">1234567 commit b</a></li></ol><p><b>To revert, rerun task from previous release tag (spruce/v0.0.1)</b></p>',
      from: "sender@mongodb.com",
      recipients: "evg-users@mongodb.com",
      subject: "2020-06-22 Spruce Deploy to 123",
    });
  });

  it("omits revert instructions during a revert", () => {
    vi.stubEnv("CI", "true");
    vi.stubEnv("DEPLOYS_EMAIL", "evg-users@mongodb.com");
    vi.stubEnv("AUTHOR_EMAIL", "sender@mongodb.com");
    vi.useFakeTimers().setSystemTime(new Date(2020, 6, 22));
    expect(
      makeEmail({
        ...defaultArgs,
        previousTag: undefined,
      }),
    ).toStrictEqual({
      body: "<ol><li>commit a</li><li>commit b</li></ol>",
      from: "sender@mongodb.com",
      recipients: "evg-users@mongodb.com",
      subject: "2020-06-22 Spruce Deploy to 123",
    });
  });
});

describe("sendEmail", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("finds previous deploy", () => {
    vi.mocked(readFileSync).mockReturnValue("1234567");
    sendEmail();
  });
});
