import prompts from "prompts";
import { prepareProdDeploy } from ".";
import { getAppToDeploy } from "../utils/environment";
import {
  assertMainBranch,
  assertWorkingDirectoryClean,
  getCommitMessages,
  getCurrentlyDeployedCommit,
  createTagAndPush,
  deleteTag,
  getLatestTag,
  pushTags,
} from "../utils/git";

const mockCommit = "0000011111222223333344444555556666677777";

vi.mock("prompts");

vi.mock("process", () => ({
  cwd: vi.fn().mockReturnValue("~/evergreen-ci/ui/apps/spruce"),
}));

vi.mock("../utils/environment");

vi.mock("../utils/git");

describe("prepareProdDeploy", () => {
  beforeEach(() => {});

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws if not on main branch", async () => {
    vi.mocked(assertMainBranch).mockImplementation(() => {
      throw Error("bad branch");
    });
    await expect(() => prepareProdDeploy()).rejects.toThrowError("bad branch");
  });

  it("throws if not on main branch", async () => {
    vi.mocked(assertWorkingDirectoryClean).mockImplementation(() => {
      throw Error("git changes found");
    });
    await expect(() => prepareProdDeploy()).rejects.toThrowError(
      "git changes found",
    );
  });

  describe("when app has new commits", () => {
    beforeEach(() => {
      vi.mocked(getAppToDeploy).mockReturnValue("spruce");
      vi.mocked(getCommitMessages).mockReturnValue("my commit messages");
      vi.mocked(getCurrentlyDeployedCommit).mockResolvedValue(
        "0000011111222223333344444555556666677777",
      );
    });

    it("creates tag with patch", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        title: "Patch",
        value: "patch",
      });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(vi.fn());
      await prepareProdDeploy();
      expect(vi.mocked(getCurrentlyDeployedCommit)).toHaveBeenCalledWith(
        "spruce",
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        `Currently Deployed Commit: ${mockCommit}`,
      );
      expect(vi.mocked(getCommitMessages)).toHaveBeenCalledWith(
        "spruce",
        mockCommit,
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        `Commit messages:
my commit messages`,
      );
      expect(vi.mocked(createTagAndPush)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(createTagAndPush)).toHaveBeenCalledWith("patch");
    });
  });

  describe("when no commits are found", () => {
    beforeEach(() => {
      vi.mocked(getAppToDeploy).mockReturnValue("spruce");
      vi.mocked(getCommitMessages).mockReturnValue("");
      vi.mocked(getCurrentlyDeployedCommit).mockResolvedValue(
        "0000011111222223333344444555556666677777",
      );
      vi.mocked(getLatestTag).mockReturnValue("spruce/v0.0.0");
    });

    it("redeploys tag when user confirms prompt", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ value: false })
        .mockResolvedValueOnce({
          value: true,
        });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(vi.fn());
      await prepareProdDeploy();
      expect(vi.mocked(getLatestTag)).toHaveBeenCalledWith("spruce");
      expect(vi.mocked(deleteTag)).toHaveBeenCalledWith("spruce/v0.0.0");
      expect(vi.mocked(pushTags)).toHaveBeenCalledOnce();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Check Evergreen for deploy progress.",
      );
    });

    it("aborts deploy when user cancels", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        value: true, // Do you want to cancel the deploy?
      });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(vi.fn());
      await prepareProdDeploy();
      expect(vi.mocked(getLatestTag)).toHaveBeenCalledWith("spruce");
      expect(vi.mocked(deleteTag)).not.toHaveBeenCalled();
      expect(vi.mocked(pushTags)).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith("Deploy cancelled.");
    });

    it("aborts deploy when user cancels on second prompt", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          value: false, // Do you want to cancel the deploy?
        })
        .mockResolvedValueOnce({
          value: false, // Do you want to trigger a deploy on the most recent existing tag?
        });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(vi.fn());
      await prepareProdDeploy();
      expect(vi.mocked(getLatestTag)).toHaveBeenCalledWith("spruce");
      expect(vi.mocked(deleteTag)).not.toHaveBeenCalled();
      expect(vi.mocked(pushTags)).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Deploy cancelled. If systems are experiencing an outage and you'd like to push the deploy directly to S3, run yarn deploy:prod --force.",
      );
    });
  });
});
