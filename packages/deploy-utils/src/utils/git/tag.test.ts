import { getLatestTag, tagIsValid, getReleaseVersion } from ".";

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
    const app = "spruce";
    const latestTag = getLatestTag(app);
    expect(tagIsValid(app, latestTag)).toEqual(true);
  });

  it("should return the latest parsley tag", () => {
    const app = "parsley";
    const latestTag = getLatestTag(app);
    expect(tagIsValid(app, latestTag)).toEqual(true);
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
