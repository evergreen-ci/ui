import { Requester } from "constants/requesters";
import { Version } from "./types";

export const version: Version = {
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
  order: 10,
};

export const versionWithGitTag: Version = {
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
  order: 9,
};

export const versionWithUpstreamProject: Version = {
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
  order: 8,
};

export const versionBroken: Version = {
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
  order: 7,
};

export const inactiveVersion: Version = {
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
  order: 6,
};

export const inactiveBrokenVersion: Version = {
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
  order: 5,
};

export const buildVariants = [
  {
    id: "1",
    displayName: "BV 1",
    builds: [
      {
        id: "ii",
        tasks: [
          {
            displayName: "Task 20",
            displayStatusCache: "started",
            execution: 0,
            id: "task_20",
            status: "started",
          },
          {
            displayName: "Task 15",
            displayStatusCache: "started",
            execution: 0,
            id: "task_15",
            status: "started",
          },
        ],
        version: "b",
      },
      {
        id: "i",
        tasks: [],
        version: "f",
      },
    ],
  },
  {
    id: "2",
    displayName: "BV 2",
    builds: [
      {
        id: "ii2",
        tasks: [
          {
            displayName: "Task 100",
            displayStatusCache: "started",
            execution: 0,
            id: "task_100",
            status: "started",
          },
        ],
        version: "b",
      },
    ],
  },
  {
    id: "3",
    displayName: "BV 3",
    builds: [
      {
        id: "iii",
        tasks: [
          {
            displayName: "Task 1",
            displayStatusCache: "",
            execution: 0,
            id: "task_1",
            status: "success",
          },
          {
            displayName: "Task 2",
            displayStatusCache: "task-timed-out",
            execution: 0,
            id: "task_2",
            status: "failed",
          },
        ],
        version: "c",
      },
    ],
  },
];
