import { getLatestTag } from ".";
import { DeployableApp } from "../types";

describe("getLatestTag", () => {
  const currentlyDeployedTagRegex = (app: DeployableApp) =>
    new RegExp(`${app}/v\\d+.\\d+.\\d+`);

  it("should return the latest tag", () => {
    const app = "spruce";
    const latestTag = getLatestTag(app);
    const latestTagIsTag = currentlyDeployedTagRegex(app).test(latestTag);
    expect(latestTagIsTag).toBeTruthy();
  });
});
