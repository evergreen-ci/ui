import { PartialRecord } from "@evg-ui/lib/types/utils";

enum Requester {
  AdHoc = "ad_hoc",
  GitHubMergeQueue = "github_merge_request",
  GitHubPR = "github_pull_request",
  GitTag = "git_tag_request",
  Gitter = "gitter_request",
  Patch = "patch_request",
  Trigger = "trigger_request",
  Debug = "debug_request",
}

const mainlineRequesters = [
  Requester.AdHoc,
  Requester.GitTag,
  Requester.Gitter,
  Requester.Trigger,
];

export const isWaterfallRequester = (requester: Requester) =>
  mainlineRequesters.includes(requester);

const requesterToTitle: PartialRecord<Requester, string> = {
  [Requester.AdHoc]: "Periodic build",
  [Requester.Debug]: "Debug",
  [Requester.GitHubMergeQueue]: "GitHub merge request",
  [Requester.GitHubPR]: "GitHub pull request",
  [Requester.GitTag]: "Git tag",
  [Requester.Gitter]: "Commit",
  [Requester.Patch]: "Patch",
  [Requester.Trigger]: "Trigger",
};

const requesterToDescription: PartialRecord<Requester, string> = {
  [Requester.Patch]: "Manual patches made via CLI or API",
  [Requester.Trigger]: "Downstream trigger versions",
};

export {
  Requester,
  requesterToTitle,
  requesterToDescription,
  mainlineRequesters,
};
