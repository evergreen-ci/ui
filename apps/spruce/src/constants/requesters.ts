import { StringMap } from "types/utils";

const adhocRequester = "ad_hoc";
const commitQueueRequester = "merge_test";
const githubMergeRequester = "github_merge_request";
const githubPRRequester = "github_pull_request";
const gitTagRequester = "git_tag_request";
const gitterRequester = "gitter_request";
const patchRequester = "patch_request";
const triggerRequester = "trigger_request";

const requesterToTitle: StringMap = {
  [githubPRRequester]: "GitHub Pull Request",
  [patchRequester]: "Patch Request",
  [gitTagRequester]: "GitHub Tag Request",
  [gitterRequester]: "Gitter Request",
  [triggerRequester]: "Trigger Request",
  [adhocRequester]: "Periodic Build",
  [githubMergeRequester]: "GitHub Merge Request",
};

const requesterToDescription: StringMap = {
  [githubPRRequester]: "GitHub PR patches",
  [patchRequester]: "Manual patches",
  [gitTagRequester]: "Git tag versions",
  [gitterRequester]: "Repotracker versions",
  [triggerRequester]: "Downstream trigger versions",
  [adhocRequester]: "Periodic build versions",
  [githubMergeRequester]: "GitHub's merge queue",
};

export {
  adhocRequester,
  commitQueueRequester,
  githubMergeRequester,
  githubPRRequester,
  gitTagRequester,
  gitterRequester,
  patchRequester,
  triggerRequester,
  requesterToTitle,
  requesterToDescription,
};
