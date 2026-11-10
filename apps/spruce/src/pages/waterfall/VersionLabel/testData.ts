import { VersionTriggerInfoFragment } from "gql/generated/types";

export type UpstreamProject = NonNullable<
  VersionTriggerInfoFragment["upstreamProject"]
>;

export type RepotrackerBaseVersion = NonNullable<
  VersionTriggerInfoFragment["repotrackerBaseVersion"]
>;

export const defaultUpstreamProject: UpstreamProject = {
  owner: "evergreen-ci",
  project: "gimlet",
  repo: "gimlet",
  revision: "9a3f1c7e5b2d48a6f0c1e3d5b7a9c2e4f6081a3d",
  task: {
    execution: 0,
    displayName: "task-display-name",
    id: "678",
  },
  triggerID: "12345",
  triggerType: "task",
  version: {
    id: "9876",
  },
};

export const defaultRepotrackerBaseVersion: RepotrackerBaseVersion = {
  id: "evergreen_ui_aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  createTime: new Date("2024-09-19T14:56:08Z"),
  message: "DEVPROD-11387: The commit this trigger version was based on",
  projectMetadata: {
    id: "evergreen",
    owner: "evergreen-ci",
    repo: "evergreen",
  },
  revision: "aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  user: {
    id: "sophie.stadler",
    displayName: "Sophie Stadler",
  },
};
