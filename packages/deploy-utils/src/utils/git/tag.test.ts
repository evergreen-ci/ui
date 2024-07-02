import { getLatestTag } from ".";
import { DeployableApp } from "../types";

describe("getLatestTag", () => {
  const currentlyDeployedTagRegex = (app: DeployableApp) =>
    new RegExp(`${app}/v\\d+.\\d+.\\d+`);

  it("currentlyDeployedTagRegex should match on a known valid tag", () => {
    const tag = currentlyDeployedTagRegex("parsley").test("parsley/v1.2.3");
    expect(tag).toBeTruthy();
  });

  it("currentlyDeployedTagRegex should not match on the wrong app's tag tag", () => {
    const tag = currentlyDeployedTagRegex("parsley").test("spruce/v1.2.3");
    expect(tag).toBeFalsy();
  });

  it("should return the latest spruce tag", () => {
    const app = "spruce";
    const latestTag = getLatestTag(app);
    const latestTagIsTag = currentlyDeployedTagRegex(app).test(latestTag);
    expect(latestTagIsTag).toBeTruthy();
  });

  it("should return the latest parsley tag", () => {
    const app = "parsley";
    const latestTag = getLatestTag(app);
    const latestTagIsTag = currentlyDeployedTagRegex(app).test(latestTag);
    expect(latestTagIsTag).toBeTruthy();
  });
});
