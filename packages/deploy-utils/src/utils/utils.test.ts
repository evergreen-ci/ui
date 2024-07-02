import { getAppToDeploy } from "./environment";
import { getGitRoot } from "./git";

vi.mock("./git", () => ({
  getGitRoot: vi.fn(),
}));

describe("getAppToDeploy", () => {
  beforeEach(() => {
    vi.mocked(getGitRoot).mockReturnValue("/Users/username/evergreen-ci/ui");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns app name when run from correct directory", () => {
    vi.spyOn(process, "cwd").mockReturnValue(
      "/Users/username/evergreen-ci/ui/apps/spruce",
    );

    expect(getAppToDeploy()).toEqual("spruce");
  });

  it("throws an error when run from directory inside app", () => {
    vi.spyOn(process, "cwd").mockReturnValue(
      "/Users/username/evergreen-ci/ui/apps/spruce/hello",
    );

    expect(() => getAppToDeploy()).toThrowError(
      "Must deploy from an app's root directory",
    );
  });

  it("throws an error when run from non-app directory", () => {
    vi.spyOn(process, "cwd").mockReturnValue(
      "/Users/username/evergreen-ci/ui/packages/storybook-addon",
    );

    expect(() => getAppToDeploy()).toThrowError(
      "Must deploy from an app's root directory",
    );
  });

  it("throws an error when run from invalid app", () => {
    vi.spyOn(process, "cwd").mockReturnValue(
      "/Users/username/evergreen-ci/ui/apps/lobster",
    );

    expect(() => getAppToDeploy()).toThrowError(
      "Must deploy from an app's root directory",
    );
  });
});
