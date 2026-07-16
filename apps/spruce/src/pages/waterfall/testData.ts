import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { Requester } from "constants/requesters";
import {
  WaterfallTaskStatsQuery,
  WaterfallTaskStatsQueryVariables,
} from "gql/generated/types";
import { WATERFALL_TASK_STATS } from "gql/queries";
import { BuildVariant, Version } from "./types";

export const version: Version = {
  activated: true,
  createTime: new Date("2024-09-19T14:56:08Z"),
  errors: [],
  gitTags: null,
  id: "evergreen_ui_aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  message:
    "DEVPROD-11387: Remove CSS grid layout, plus some additional description to demonstrate the overflow capabilities of the component (#397)",
  order: 10,
  requester: Requester.Gitter,
  revision: "aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  user: {
    displayName: "Sophie Stadler",
    userId: "sophie.stadler",
  },
};

export const versionWithGitTag: Version = {
  activated: true,
  createTime: new Date("2024-09-19T16:14:10Z"),
  errors: [],
  gitTags: [
    {
      tag: "parsley/v2.1.64",
    },
  ],
  id: "evergreen_ui_deb77a36604446272d610d267f1cd9f95e4fe8ff",
  message: "parsley/v2.1.64",
  order: 9,
  requester: Requester.GitTag,
  revision: "deb77a36604446272d610d267f1cd9f95e4fe8ff",
  user: {
    displayName: "Sophie Stadler",
    userId: "sophie.stadler",
  },
};

export const versionWithUpstreamProject: Version = {
  activated: true,
  createTime: new Date("2024-09-19T16:06:54Z"),
  errors: [],
  gitTags: [
    {
      tag: "spruce/v4.1.87",
    },
  ],
  id: "evergreen_ui_130948895a46d4fd04292e7783069918e4e7cd5a",
  message: "spruce/v4.1.87",
  order: 8,
  requester: Requester.Trigger,
  revision: "130948895a46d4fd04292e7783069918e4e7cd5a",
  user: {
    displayName: "Sophie Stadler",
    userId: "sophie.stadler",
  },
};

export const versionBroken: Version = {
  activated: true,
  createTime: new Date("2024-09-19T14:56:08Z"),
  errors: ["errors happened"],
  gitTags: null,
  id: "evergreen_ui_aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  message:
    "DEVPROD-11387: Remove CSS grid layout, plus some additional description to demonstrate the overflow capabilities of the component (#397)",
  order: 7,
  requester: Requester.Gitter,
  revision: "aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  user: {
    displayName: "Sophie Stadler",
    userId: "sophie.stadler",
  },
};

export const inactiveVersion: Version = {
  activated: false,
  createTime: new Date("2024-10-24T14:56:08Z"),
  errors: [],
  gitTags: null,
  id: "81667704832f1021cc9573bd5edafc32",
  message: "Inactive Version by Sophie Stadler",
  order: 6,
  requester: Requester.Gitter,
  revision: "a659b9908f6be84afd8142e9c2e403783e1385afefaa728792b3c23b9d6acf7a",
  user: {
    displayName: "Sophie Stadler",
    userId: "sophie.stadler",
  },
};

export const inactiveBrokenVersion: Version = {
  activated: false,
  createTime: new Date("2024-10-25T14:56:08Z"),
  errors: ["Error string"],
  gitTags: null,
  id: "08576a4e52f9c350430182597a4b22c0",
  message: "Inactive Version by Sophie Stadler",
  order: 5,
  requester: Requester.Gitter,
  revision: "a659b9908f6be84afd8142e9c2e403783e1385afefaa728792b3c23b9d6acf7a",
  user: {
    displayName: "Sophie Stadler",
    userId: "sophie.stadler",
  },
};

export const buildVariants: BuildVariant[] = [
  {
    builds: [
      {
        activated: true,
        id: "ii",
        tasks: [
          {
            displayName: "Task 20",
            displayStatusCache: "started",
            execution: 0,
            id: "task_20",
          },
          {
            displayName: "Task 15",
            displayStatusCache: "started",
            execution: 0,
            id: "task_15",
          },
        ],
        version: "b",
      },
      {
        activated: false,
        id: "i",
        tasks: [],
        version: "f",
      },
    ],
    displayName: "BV 1",
    id: "1",
  },
  {
    builds: [
      {
        activated: true,
        id: "ii2",
        tasks: [
          {
            displayName: "Task 100",
            displayStatusCache: "started",
            execution: 0,
            id: "task_100",
          },
        ],
        version: "b",
      },
    ],
    displayName: "BV 2",
    id: "2",
  },
  {
    builds: [
      {
        activated: true,
        id: "iii",
        tasks: [
          {
            displayName: "Task 1",
            displayStatusCache: "",
            execution: 0,
            id: "task_1",
          },
          {
            displayName: "Task 2",
            displayStatusCache: "task-timed-out",
            execution: 0,
            id: "task_2",
          },
        ],
        version: "c",
      },
    ],
    displayName: "BV 3",
    id: "3",
  },
];

export const getTaskStatsMock = (
  versionId: string,
): ApolloMock<WaterfallTaskStatsQuery, WaterfallTaskStatsQueryVariables> => ({
  request: {
    query: WATERFALL_TASK_STATS,
    variables: { versionId },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        id: versionId,
        taskStatusStats: {
          __typename: "TaskStats",

          counts: [
            {
              __typename: "StatusCount",
              count: 4,
              status: "blocked",
            },
            {
              __typename: "StatusCount",
              count: 3,
              status: "failed",
            },
            {
              __typename: "StatusCount",
              count: 3,
              status: "setup-failed",
            },
            {
              __typename: "StatusCount",
              count: 22,
              status: "started",
            },
            {
              __typename: "StatusCount",
              count: 255,
              status: "success",
            },
            {
              __typename: "StatusCount",
              count: 2313,
              status: "unscheduled",
            },
            {
              __typename: "StatusCount",
              count: 100,
              status: "will-run",
            },
          ],
        },
      },
    },
  },
});

export const versions: Version[] = [
  {
    activated: false,
    createTime: new Date("2024-09-20T14:56:08Z"),
    errors: [],
    id: "a",
    message: "bar",
    order: 5,
    requester: "gitter_request",
    revision: "a",
    user: {
      displayName: "Sophie Stadler",
      userId: "sophie.stadler",
    },
    waterfallBuilds: null,
  },
  {
    activated: true,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    id: "b",
    message: "foo",
    order: 4,
    requester: "gitter_request",
    revision: "b",
    user: {
      displayName: "Sophie Stadler",
      userId: "sophie.stadler",
    },
    waterfallBuilds: [
      {
        activated: true,
        buildVariant: "1",
        displayName: "BV 1",
        id: "ii",
        tasks: [
          {
            displayName: "Task 20",
            displayStatusCache: "started",
            execution: 0,
            id: "task_20",
          },
          {
            displayName: "Task 15",
            displayStatusCache: "started",
            execution: 0,
            id: "task_15",
          },
        ],
      },
      {
        activated: true,
        buildVariant: "2",
        displayName: "BV 2",
        id: "ii2",
        tasks: [
          {
            displayName: "Task 100",
            displayStatusCache: "started",
            execution: 0,
            id: "task_100",
          },
        ],
      },
    ],
  },
  {
    activated: true,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    id: "c",
    message: "foo",
    order: 3,
    requester: "gitter_request",
    revision: "c",
    user: {
      displayName: "Sophie Stadler",
      userId: "sophie.stadler",
    },
    waterfallBuilds: [
      {
        activated: true,
        buildVariant: "3",
        displayName: "BV 3",
        id: "iii",
        tasks: [
          {
            displayName: "Task 1",
            displayStatusCache: "",
            execution: 0,
            id: "task_1",
          },
          {
            displayName: "Task 2",
            displayStatusCache: "task-timed-out",
            execution: 0,
            id: "task_2",
          },
        ],
      },
    ],
  },
  {
    activated: false,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    id: "d",
    message: "foo",
    order: 2,
    requester: "gitter_request",
    revision: "d",
    user: {
      displayName: "Sophie Stadler",
      userId: "sophie.stadler",
    },
  },
  {
    activated: false,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    id: "e",
    message: "foo",
    order: 1,
    requester: "gitter_request",
    revision: "e",
    user: {
      displayName: "Sophie Stadler",
      userId: "sophie.stadler",
    },
  },
  {
    activated: true,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    id: "f",
    message: "foo",
    order: 0,
    requester: "gitter_request",
    revision: "f",
    user: {
      displayName: "Sophie Stadler",
      userId: "sophie.stadler",
    },
    waterfallBuilds: [
      {
        activated: false,
        buildVariant: "1",
        displayName: "BV 1",
        id: "i",
        tasks: [],
      },
    ],
  },
];

export const groupedVersions = [
  {
    inactiveVersions: [versions[0]],
    version: null,
  },
  {
    inactiveVersions: null,
    version: versions[1],
  },
  {
    inactiveVersions: null,
    version: versions[2],
  },
  {
    inactiveVersions: [versions[3], versions[4]],
    version: null,
  },
  {
    inactiveVersions: null,
    version: versions[5],
  },
];
