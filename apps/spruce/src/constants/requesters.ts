import { PartialRecord } from "types/utils";

// Not included in Requester enum because it will be deprecated.
const commitQueueRequester = "merge_test";

enum Requester {
  AdHoc = "ad_hoc",
  GitHubMergeQueue = "github_merge_request",
  GitHubPR = "github_pull_request",
  GitTag = "git_tag_request",
  Gitter = "gitter_request",
  Patch = "patch_request",
  Trigger = "trigger_request",
}

const requesterToTitle: PartialRecord<Requester, string> = {
  [Requester.AdHoc]: "Ad Hoc Request",
  [Requester.GitHubMergeQueue]: "GitHub Merge Request",
  [Requester.GitHubPR]: "GitHub Pull Request",
  [Requester.GitTag]: "Git Tag Request",
  [Requester.Gitter]: "Gitter Request",
  [Requester.Patch]: "Patch Request",
  [Requester.Trigger]: "Trigger Request",
};

const requesterToDescription: PartialRecord<Requester, string> = {
  [Requester.AdHoc]: "Periodic build versions",
  [Requester.Gitter]: "Repotracker versions",
  [Requester.Patch]: "Manual patches made via CLI or API",
  [Requester.Trigger]: "Downstream trigger versions",
};

export {
  Requester,
  commitQueueRequester,
  requesterToTitle,
  requesterToDescription,
};
