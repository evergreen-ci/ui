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
  user: {
    userId: "sophie.stadler",
    displayName: "Sophie Stadler",
  },
  createTime: new Date("2024-09-19T14:56:08Z"),
  errors: [],
  gitTags: null,
  id: "evergreen_ui_aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  message:
    "DEVPROD-11387: Remove CSS grid layout, plus some additional description to demonstrate the overflow capabilities of the component (#397)",
  requester: Requester.Gitter,
  revision: "aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  order: 10,
};

export const versionWithGitTag: Version = {
  activated: true,
  user: {
    userId: "sophie.stadler",
    displayName: "Sophie Stadler",
  },
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
  order: 9,
};

export const versionWithUpstreamProject: Version = {
  activated: true,
  user: {
    userId: "sophie.stadler",
    displayName: "Sophie Stadler",
  },
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
  order: 8,
};

export const versionBroken: Version = {
  activated: true,
  user: {
    userId: "sophie.stadler",
    displayName: "Sophie Stadler",
  },
  createTime: new Date("2024-09-19T14:56:08Z"),
  errors: ["errors happened"],
  gitTags: null,
  id: "evergreen_ui_aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  message:
    "DEVPROD-11387: Remove CSS grid layout, plus some additional description to demonstrate the overflow capabilities of the component (#397)",
  requester: Requester.Gitter,
  revision: "aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  order: 7,
};

export const inactiveVersion: Version = {
  activated: false,
  user: {
    userId: "sophie.stadler",
    displayName: "Sophie Stadler",
  },
  createTime: new Date("2024-10-24T14:56:08Z"),
  errors: [],
  gitTags: null,
  id: "81667704832f1021cc9573bd5edafc32",
  message: "Inactive Version by Sophie Stadler",
  requester: Requester.Gitter,
  revision: "a659b9908f6be84afd8142e9c2e403783e1385afefaa728792b3c23b9d6acf7a",
  order: 6,
};

export const inactiveBrokenVersion: Version = {
  activated: false,
  user: {
    userId: "sophie.stadler",
    displayName: "Sophie Stadler",
  },
  createTime: new Date("2024-10-25T14:56:08Z"),
  errors: ["Error string"],
  gitTags: null,
  id: "08576a4e52f9c350430182597a4b22c0",
  message: "Inactive Version by Sophie Stadler",
  requester: Requester.Gitter,
  revision: "a659b9908f6be84afd8142e9c2e403783e1385afefaa728792b3c23b9d6acf7a",
  order: 5,
};

export const buildVariants: BuildVariant[] = [
  {
    id: "1",
    displayName: "BV 1",
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
        activated: false,
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
        activated: true,
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
        activated: true,
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
              status: "blocked",
              count: 4,
            },
            {
              __typename: "StatusCount",
              status: "failed",
              count: 3,
            },
            {
              __typename: "StatusCount",
              status: "setup-failed",
              count: 3,
            },
            {
              __typename: "StatusCount",
              status: "started",
              count: 22,
            },
            {
              __typename: "StatusCount",
              status: "success",
              count: 255,
            },
            {
              __typename: "StatusCount",
              status: "unscheduled",
              count: 2313,
            },
            {
              __typename: "StatusCount",
              status: "will-run",
              count: 100,
            },
          ],
        },
      },
    },
  },
});

export const versions: Version[] = [
  {
    id: "a",
    user: {
      userId: "sophie.stadler",
      displayName: "Sophie Stadler",
    },
    activated: false,
    createTime: new Date("2024-09-20T14:56:08Z"),
    errors: [],
    message: "bar",
    requester: "gitter_request",
    revision: "a",
    order: 5,
    waterfallBuilds: null,
  },
  {
    id: "b",
    user: {
      userId: "sophie.stadler",
      displayName: "Sophie Stadler",
    },
    activated: true,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    message: "foo",
    requester: "gitter_request",
    revision: "b",
    order: 4,
    waterfallBuilds: [
      {
        activated: true,
        id: "ii",
        buildVariant: "1",
        displayName: "BV 1",
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
      },
      {
        activated: true,
        id: "ii2",
        buildVariant: "2",
        displayName: "BV 2",
        tasks: [
          {
            displayName: "Task 100",
            displayStatusCache: "started",
            execution: 0,
            id: "task_100",
            status: "started",
          },
        ],
      },
    ],
  },
  {
    id: "c",
    user: {
      userId: "sophie.stadler",
      displayName: "Sophie Stadler",
    },
    activated: true,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    message: "foo",
    requester: "gitter_request",
    revision: "c",
    order: 3,
    waterfallBuilds: [
      {
        activated: true,
        id: "iii",
        buildVariant: "3",
        displayName: "BV 3",
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
      },
    ],
  },
  {
    id: "d",
    user: {
      userId: "sophie.stadler",
      displayName: "Sophie Stadler",
    },
    activated: false,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    message: "foo",
    requester: "gitter_request",
    revision: "d",
    order: 2,
  },
  {
    id: "e",
    user: {
      userId: "sophie.stadler",
      displayName: "Sophie Stadler",
    },
    activated: false,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    message: "foo",
    requester: "gitter_request",
    revision: "e",
    order: 1,
  },
  {
    id: "f",
    user: {
      userId: "sophie.stadler",
      displayName: "Sophie Stadler",
    },
    activated: true,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    message: "foo",
    requester: "gitter_request",
    revision: "f",
    order: 0,
    waterfallBuilds: [
      {
        activated: false,
        id: "i",
        buildVariant: "1",
        displayName: "BV 1",
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
