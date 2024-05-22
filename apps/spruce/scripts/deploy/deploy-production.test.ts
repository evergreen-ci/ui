import prompts from "prompts";
import { evergreenDeploy, localDeploy, ciDeploy } from "./deploy-production";
import { runDeploy } from "./utils/deploy";
import { isRunningOnCI } from "./utils/environment";
import { getCommitMessages, getCurrentlyDeployedCommit } from "./utils/git";
import { tagUtils } from "./utils/git/tag";

vi.mock("prompts");
vi.mock("./utils/git/tag");
vi.mock("./utils/git");
vi.mock("./utils/deploy");
vi.mock("./utils/environment");

describe("deploy-production", () => {
  let consoleLogMock;
  let processExitMock;
  let consoleErrorMock;

  beforeEach(() => {
    consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});
    processExitMock = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("evergreenDeploy", () => {
    it("should force deploy if no new commits and user confirms", async () => {
      vi.mocked(getCommitMessages).mockReturnValue("");
      vi.mocked(prompts).mockResolvedValue({ value: true });

      await evergreenDeploy();

      expect(tagUtils.deleteTag).toHaveBeenCalled();
      expect(tagUtils.pushTags).toHaveBeenCalled();
      expect(consoleLogMock).toHaveBeenCalledWith(
        "Check Evergreen for deploy progress.",
      );
    });

    it("should cancel deploy if no new commits and user denies", async () => {
      vi.mocked(getCommitMessages).mockReturnValue("");
      vi.mocked(prompts).mockResolvedValue({ value: false });
      await evergreenDeploy();
      expect(tagUtils.deleteTag).not.toHaveBeenCalled();
      expect(tagUtils.pushTags).not.toHaveBeenCalled();
      expect(consoleLogMock).toHaveBeenCalledWith(
        "Deploy canceled. If systems are experiencing an outage and you'd like to push the deploy directly to S3, run yarn deploy:prod --local.",
      );
    });

    it("should deploy if new commits, user confirms and create tag succeeds", async () => {
      vi.mocked(getCommitMessages).mockReturnValue("getCommitMessages result");
      vi.mocked(prompts).mockResolvedValue({ value: true });
      const createTagAndPushMock = vi
        .mocked(tagUtils.createTagAndPush)
        .mockImplementation(() => {});
      vi.mocked(getCurrentlyDeployedCommit).mockReturnValue(
        "getCurrentlyDeployedCommit mock",
      );
      await evergreenDeploy();
      expect(consoleLogMock).toHaveBeenCalledTimes(2);
      expect(consoleLogMock).toHaveBeenCalledWith(
        "Currently Deployed Commit: getCurrentlyDeployedCommit mock",
      );
      expect(consoleLogMock).toHaveBeenCalledWith(
        "Commit messages:\ngetCommitMessages result",
      );
      expect(createTagAndPushMock).toBeCalledTimes(1);
    });

    it("return exit code 1 if an error is thrown", async () => {
      const e = new Error("test error", { cause: "cause of test error" });
      vi.mocked(getCommitMessages).mockReturnValue("getCommitMessages result");
      vi.mocked(prompts).mockResolvedValue({ value: true });
      vi.mocked(tagUtils.createTagAndPush).mockImplementation(() => {
        throw e;
      });
      expect(await evergreenDeploy());
      expect(consoleErrorMock).toHaveBeenCalledWith(e);
      expect(consoleLogMock).toHaveBeenCalledWith("Deploy failed.");
      expect(processExitMock).toHaveBeenCalledWith(1);
    });
  });

  describe("localDeploy", () => {
    it("should run deploy when user confirms", async () => {
      vi.mocked(prompts).mockResolvedValue({ value: true });
      await localDeploy();
      expect(runDeploy).toHaveBeenCalled();
    });

    it("should not run deploy when user denies", async () => {
      vi.mocked(prompts).mockResolvedValue({ value: false });
      await localDeploy();
      expect(runDeploy).not.toHaveBeenCalled();
    });

    it("logs and error and returns exit code 1 when error is thrown", async () => {
      vi.mocked(prompts).mockResolvedValue({ value: true });
      const e = new Error("error mock");
      vi.mocked(runDeploy).mockImplementation(() => {
        throw e;
      });
      await localDeploy();
      expect(consoleErrorMock).toHaveBeenCalledWith(e);
      expect(consoleErrorMock).toHaveBeenCalledWith(
        "Local deploy failed. Aborting.",
      );
      expect(processExitMock).toHaveBeenCalledWith(1);
    });
  });

  describe("ciDeploy", () => {
    it("returns exit code 1 when not running in CI", async () => {
      vi.mocked(isRunningOnCI).mockReturnValue(false);
      await ciDeploy();
      expect(consoleErrorMock).toHaveBeenCalledWith(
        new Error("Not running on CI"),
      );
      expect(consoleErrorMock).toHaveBeenCalledWith(
        "CI deploy failed. Aborting.",
      );
      expect(processExitMock).toHaveBeenCalledWith(1);
    });

    it("should run deploy when running on CI", async () => {
      vi.mocked(isRunningOnCI).mockReturnValue(true);
      await ciDeploy();
      expect(runDeploy).toHaveBeenCalled();
    });
  });
});
