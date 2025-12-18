import { getAppToDeploy } from "./environment";
import * as git from "./git";

describe("getAppToDeploy", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns app name when in spruce directory", () => {
    vi.spyOn(git, "getGitRoot").mockReturnValue("/repo");
    vi.stubGlobal("process", { cwd: () => "/repo/apps/spruce" });
    expect(getAppToDeploy()).toEqual("spruce");
  });

  it("returns app name when in parsley directory", () => {
    vi.spyOn(git, "getGitRoot").mockReturnValue("/repo");
    vi.stubGlobal("process", { cwd: () => "/repo/apps/parsley" });
    expect(getAppToDeploy()).toEqual("parsley");
  });

  it("throws an error when run from directory inside app", () => {
    vi.spyOn(git, "getGitRoot").mockReturnValue("/repo");
    vi.stubGlobal("process", { cwd: () => "/repo/apps/spruce/src" });
    expect(() => getAppToDeploy()).toThrowError(
      "Must deploy from an app's root directory",
    );
  });

  it("throws an error when run from non-app directory", () => {
    vi.spyOn(git, "getGitRoot").mockReturnValue("/repo");
    vi.stubGlobal("process", { cwd: () => "/repo/packages/deploy-utils" });
    expect(() => getAppToDeploy()).toThrowError(
      "Must deploy from an app's root directory",
    );
  });

  it("throws an error when run from invalid app", () => {
    vi.spyOn(git, "getGitRoot").mockReturnValue("/repo");
    vi.stubGlobal("process", { cwd: () => "/repo/apps/some-other-app" });
    expect(() => getAppToDeploy()).toThrowError(
      "Must deploy from an app's root directory",
    );
  });
});
