import { Requester } from "constants/requesters";

export const version = {
  activated: true,
  author: "Sophie Stadler",
  createTime: new Date("2024-09-19T14:56:08Z"),
  errors: [],
  gitTags: null,
  id: "evergreen_ui_aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  message:
    "DEVPROD-11387: Remove CSS grid layout, plus some additional description to demonstrate the overflow capabilities of the component (#397)",
  requester: Requester.Gitter,
  revision: "aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  upstreamProject: null,
};

export const versionWithGitTag = {
  activated: true,
  author: "Sophie Stadler",
  createTime: new Date("2024-09-19T16:14:10Z"),
  errors: [],
  gitTags: [
    {
      tag: "parsley/v2.1.64",
    },
  ],
  id: "evergreen_ui_deb77a36604446272d610d267f1cd9f95e4fe8ff",
  message: "parsley/v2.1.64",
  requester: Requester.GitTag,
  revision: "deb77a36604446272d610d267f1cd9f95e4fe8ff",
  upstreamProject: null,
};

export const versionWithUpstreamProject = {
  activated: true,
  author: "Sophie Stadler",
  createTime: new Date("2024-09-19T16:06:54Z"),
  errors: [],
  gitTags: [
    {
      tag: "spruce/v4.1.87",
    },
  ],
  id: "evergreen_ui_130948895a46d4fd04292e7783069918e4e7cd5a",
  message: "spruce/v4.1.87",
  requester: Requester.GitTag,
  revision: "130948895a46d4fd04292e7783069918e4e7cd5a",
  upstreamProject: {
    owner: "evergreen-ci",
    project: "evergreen",
    repo: "evergreen",
    revision: "abcdefg",
    task: {
      execution: 0,
      id: "678",
    },
    triggerID: "12345",
    triggerType: "task",
    version: {
      id: "9876",
    },
  },
};

export const versionBroken = {
  activated: true,
  author: "Sophie Stadler",
  createTime: new Date("2024-09-19T14:56:08Z"),
  errors: ["errors happened"],
  gitTags: null,
  id: "evergreen_ui_aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  message:
    "DEVPROD-11387: Remove CSS grid layout, plus some additional description to demonstrate the overflow capabilities of the component (#397)",
  requester: Requester.Gitter,
  revision: "aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  upstreamProject: null,
};

export const inactiveVersion = {
  activated: false,
  author: "Sophie Stadler",
  createTime: new Date("2024-10-24T14:56:08Z"),
  errors: [],
  gitTags: null,
  id: "81667704832f1021cc9573bd5edafc32",
  message: "Inactive Version by Sophie Stadler",
  requester: Requester.Gitter,
  revision: "a659b9908f6be84afd8142e9c2e403783e1385afefaa728792b3c23b9d6acf7a",
  upstreamProject: null,
};

export const inactiveBrokenVersion = {
  activated: false,
  author: "Sophie Stadler",
  createTime: new Date("2024-10-25T14:56:08Z"),
  errors: ["Error string"],
  gitTags: null,
  id: "08576a4e52f9c350430182597a4b22c0",
  message: "Inactive Version by Sophie Stadler",
  requester: Requester.Gitter,
  revision: "a659b9908f6be84afd8142e9c2e403783e1385afefaa728792b3c23b9d6acf7a",
  upstreamProject: null,
};
