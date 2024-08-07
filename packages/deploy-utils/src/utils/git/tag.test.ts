import { getLatestTag, getTagByCommit, tagIsGreater, tagIsValid } from ".";

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

describe("getTagByCommit", () => {
  it("returns a tag when commit has a match", () => {
    expect(
      tagIsValid(
        "spruce",
        getTagByCommit("df25ba8b40036eca5f7e41b7f75a96ff82fbe3b6"),
      ),
    ).toBe(true);
  });

  it("returns an empty string when no matching tag is found", () => {
    expect(getTagByCommit("b0319b54b52b6a467af6f428dcccae9956f2e60d")).toBe("");
  });
});

describe("tagIsGreater", () => {
  it("compares two app-prefixed tags correctly", () => {
    expect(tagIsGreater("spruce/v3.0.0", "spruce/v2.0.0")).toBe(true);
    expect(tagIsGreater("parsley/v1.0.0", "parsley/v2.0.0")).toBe(false);
  });

  it("correctly compares tags without prefix", () => {
    expect(tagIsGreater("3.1.2", "3.1.1")).toBe(true);
    expect(tagIsGreater("v1.1.2", "v1.2.1")).toBe(false);
  });
});
