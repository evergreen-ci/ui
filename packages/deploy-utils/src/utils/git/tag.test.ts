import { getLatestTag, tagIsValid } from ".";

describe("tagIsValid", () => {
  it("should match on a known valid tag", () => {
    expect(tagIsValid("parsley", "parsley/v1.2.3")).toEqual(true);
  });

  it("should not match on the wrong app's tag tag", () => {
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
