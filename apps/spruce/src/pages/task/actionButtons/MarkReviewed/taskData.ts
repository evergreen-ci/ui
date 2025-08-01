import { TaskQuery } from "gql/generated/types";

export const taskData: NonNullable<TaskQuery["task"]> = {
  id: "evergreen_ui_parsley_test_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51",
  buildVariant: "parsley",
  buildVariantDisplayName: "Parsley",
  displayName: "test",
  displayStatus: "failed",
  execution: 0,
  revision: "da7ae2020c5af16fdc5daf95a6420b36ec742a06",
  __typename: "Task",
  aborted: false,
  abortInfo: null,
  activatedBy: "sophie.stadler",
  activatedTime: new Date("2025-07-17T20:30:58.127Z"),
  ami: "ami-0fe0d6af421ebc65f",
  annotation: null,
  baseTask: {
    id: "evergreen_ui_parsley_test_da7ae2020c5af16fdc5daf95a6420b36ec742a06_25_07_17_16_46_56",
    execution: 0,
    timeTaken: 125703,
    versionMetadata: {
      id: "evergreen_ui_da7ae2020c5af16fdc5daf95a6420b36ec742a06",
      revision: "da7ae2020c5af16fdc5daf95a6420b36ec742a06",
      __typename: "Version",
    },
    __typename: "Task",
  },
  blocked: false,
  canAbort: false,
  canDisable: true,
  canModifyAnnotation: true,
  canOverrideDependencies: false,
  canRestart: true,
  canSchedule: false,
  canSetPriority: false,
  canUnschedule: false,
  dependsOn: null,
  details: {
    description: "",
    diskDevices: [],
    failingCommand: "",
    failureMetadataTags: [],
    oomTracker: {
      detected: false,
      pids: null,
      __typename: "OomTrackerInfo",
    },
    otherFailingCommands: [
      {
        failureMetadataTags: [],
        fullDisplayName:
          "'attach.xunit_results' in function 'attach-cypress-results' (step 3.3 of 10) in block 'post'",
        __typename: "FailingCommand",
      },
      {
        failureMetadataTags: [],
        fullDisplayName:
          "'s3.put' in function 'attach-logkeeper-logs' (step 5 of 10) in block 'post'",
        __typename: "FailingCommand",
      },
      {
        failureMetadataTags: [],
        fullDisplayName:
          "'s3.put' in function 'attach-mongod-logs' (step 6 of 10) in block 'post'",
        __typename: "FailingCommand",
      },
      {
        failureMetadataTags: [],
        fullDisplayName:
          "'s3.put' in function 'attach-restore-logs' (step 7 of 10) in block 'post'",
        __typename: "FailingCommand",
      },
      {
        failureMetadataTags: [],
        fullDisplayName:
          "'s3.put' in function 'attach-source-map' (step 8 of 10) in block 'post'",
        __typename: "FailingCommand",
      },
    ],
    status: "failed",
    timedOut: false,
    timeoutType: "",
    traceID: "6e52941f6e33a086fba12d3174815014",
    type: "",
    __typename: "TaskEndDetail",
  },
  displayTask: null,
  distroId: "ubuntu2204-large",
  estimatedStart: 0,
  executionTasksFull: null,
  expectedDuration: 129456,
  files: {
    fileCount: 0,
    __typename: "TaskFiles",
  },
  finishTime: new Date("2025-07-17T20:36:31.37Z"),
  generatedBy:
    "evergreen_ui_generator_generate_tasks_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51",
  generatedByName: "generate-tasks",
  hostId: "i-0defcae9395f8e081",
  imageId: "ubuntu2204",
  ingestTime: new Date("2025-07-17T20:30:58.127Z"),
  isPerfPluginEnabled: false,
  latestExecution: 0,
  logs: {
    agentLogLink:
      "https://evergreen.mongodb.com/task_log_raw/evergreen_ui_parsley_test_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51/0?type=E",
    allLogLink:
      "https://evergreen.mongodb.com/task_log_raw/evergreen_ui_parsley_test_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51/0?type=ALL",
    eventLogLink:
      "https://evergreen.mongodb.com/event_log/task/evergreen_ui_parsley_test_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51",
    systemLogLink:
      "https://evergreen.mongodb.com/task_log_raw/evergreen_ui_parsley_test_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51/0?type=S",
    taskLogLink:
      "https://evergreen.mongodb.com/task_log_raw/evergreen_ui_parsley_test_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51/0?type=T",
    __typename: "TaskLogLinks",
  },
  minQueuePosition: 0,
  order: 2894,
  patchNumber: 2894,
  pod: null,
  priority: 0,
  project: {
    id: "65f08ccac9ec449f57b4015d",
    identifier: "evergreen-ui",
    owner: "evergreen-ci",
    repo: "ui",
    __typename: "Project",
  },
  requester: "github_pull_request",
  resetWhenFinished: false,
  spawnHostLink:
    "https://evergreen.mongodb.com/spawn?distro_id=ubuntu2204-large&task_id=evergreen_ui_parsley_test_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51",
  startTime: new Date("2025-07-17T20:34:23.615Z"),
  status: "failed",
  stepbackInfo: {
    lastFailingStepbackTaskId: "",
    lastPassingStepbackTaskId: "",
    nextStepbackTaskId: "",
    previousStepbackTaskId: "",
    __typename: "StepbackInfo",
  },
  tags: [],
  timeTaken: 127755,
  versionMetadata: {
    id: "68795d3e3ec03f0007deb52c",
    author: "sophie.stadler",
    isPatch: true,
    message:
      "'evergreen-ci/ui' pull request #940 by sophstad: DEVPROD-19315: Stabilize useQueryParam hooks (https://github.com/evergreen-ci/ui/pull/940)",
    order: 2894,
    project: "65f08ccac9ec449f57b4015d",
    projectIdentifier: "evergreen-ui",
    revision: "da7ae2020c5af16fdc5daf95a6420b36ec742a06",
    __typename: "Version",
  },
};

export const displayTaskData: NonNullable<TaskQuery["task"]> &
  Required<Pick<NonNullable<TaskQuery["task"]>, "executionTasksFull">> = {
  id: "evergreen_ui_spruce_display_e2e_parallel_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51",
  buildVariant: "spruce",
  buildVariantDisplayName: "Spruce",
  displayName: "e2e_parallel",
  displayStatus: "failed",
  execution: 0,
  revision: "da7ae2020c5af16fdc5daf95a6420b36ec742a06",
  __typename: "Task",
  aborted: false,
  abortInfo: null,
  activatedBy: "",
  activatedTime: new Date("2025-07-17T20:31:07.64Z"),
  ami: null,
  annotation: null,
  baseTask: null,
  blocked: false,
  canAbort: false,
  canDisable: true,
  canModifyAnnotation: true,
  canOverrideDependencies: false,
  canRestart: true,
  canSchedule: false,
  canSetPriority: false,
  canUnschedule: false,
  dependsOn: null,
  details: {
    description: "",
    diskDevices: [],
    failingCommand: "",
    failureMetadataTags: [],
    oomTracker: {
      detected: false,
      pids: null,
      __typename: "OomTrackerInfo",
    },
    otherFailingCommands: [
      {
        failureMetadataTags: [],
        fullDisplayName:
          "'s3.put' in function 'attach-logkeeper-logs' (step 5 of 10) in block 'post'",
        __typename: "FailingCommand",
      },
      {
        failureMetadataTags: [],
        fullDisplayName:
          "'attach.xunit_results' in function 'attach-test-results' (step 10 of 10) in block 'post'",
        __typename: "FailingCommand",
      },
    ],
    status: "failed",
    timedOut: false,
    timeoutType: "",
    traceID: "",
    type: "",
    __typename: "TaskEndDetail",
  },
  displayTask: null,
  distroId: "",
  estimatedStart: 0,
  executionTasksFull: [
    {
      id: "evergreen_ui_spruce_e2e_spruce_0_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51",
      buildVariant: "spruce",
      buildVariantDisplayName: "Spruce",
      displayName: "e2e_spruce_0",
      displayStatus: "failed",
      execution: 0,
      revision: "da7ae2020c5af16fdc5daf95a6420b36ec742a06",
      __typename: "Task",
      projectIdentifier: "evergreen-ui",
    },
    {
      id: "evergreen_ui_spruce_e2e_spruce_1_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51",
      buildVariant: "spruce",
      buildVariantDisplayName: "Spruce",
      displayName: "e2e_spruce_1",
      displayStatus: "failed",
      execution: 0,
      revision: "da7ae2020c5af16fdc5daf95a6420b36ec742a06",
      __typename: "Task",
      projectIdentifier: "evergreen-ui",
    },
    {
      id: "evergreen_ui_spruce_e2e_spruce_2_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51",
      buildVariant: "spruce",
      buildVariantDisplayName: "Spruce",
      displayName: "e2e_spruce_2",
      displayStatus: "failed",
      execution: 0,
      revision: "da7ae2020c5af16fdc5daf95a6420b36ec742a06",
      __typename: "Task",
      projectIdentifier: "evergreen-ui",
    },
    {
      id: "evergreen_ui_spruce_e2e_spruce_3_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51",
      buildVariant: "spruce",
      buildVariantDisplayName: "Spruce",
      displayName: "e2e_spruce_3",
      displayStatus: "success",
      execution: 0,
      revision: "da7ae2020c5af16fdc5daf95a6420b36ec742a06",
      __typename: "Task",
      projectIdentifier: "evergreen-ui",
    },
  ],
  expectedDuration: 0,
  files: {
    fileCount: 12,
    __typename: "TaskFiles",
  },
  finishTime: new Date("2025-07-17T20:43:21.558Z"),
  generatedBy:
    "evergreen_ui_generator_generate_spruce_e2e_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51",
  generatedByName: "generate-spruce-e2e",
  hostId: "",
  imageId: "",
  ingestTime: new Date("2025-07-17T20:31:07.64Z"),
  isPerfPluginEnabled: false,
  latestExecution: 0,
  logs: {
    agentLogLink:
      "https://evergreen.mongodb.com/task_log_raw/evergreen_ui_spruce_display_e2e_parallel_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51/0?type=E",
    allLogLink:
      "https://evergreen.mongodb.com/task_log_raw/evergreen_ui_spruce_display_e2e_parallel_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51/0?type=ALL",
    eventLogLink:
      "https://evergreen.mongodb.com/event_log/task/evergreen_ui_spruce_display_e2e_parallel_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51",
    systemLogLink:
      "https://evergreen.mongodb.com/task_log_raw/evergreen_ui_spruce_display_e2e_parallel_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51/0?type=S",
    taskLogLink:
      "https://evergreen.mongodb.com/task_log_raw/evergreen_ui_spruce_display_e2e_parallel_patch_da7ae2020c5af16fdc5daf95a6420b36ec742a06_68795d3e3ec03f0007deb52c_25_07_17_20_29_51/0?type=T",
    __typename: "TaskLogLinks",
  },
  minQueuePosition: 0,
  order: 2894,
  patchNumber: 2894,
  pod: null,
  priority: 0,
  project: {
    id: "65f08ccac9ec449f57b4015d",
    identifier: "evergreen-ui",
    owner: "evergreen-ci",
    repo: "ui",
    __typename: "Project",
  },
  requester: "github_pull_request",
  resetWhenFinished: false,
  spawnHostLink: null,
  startTime: new Date("2025-07-17T20:32:39.05Z"),
  status: "success",
  stepbackInfo: null,
  tags: [],
  timeTaken: 2077208,
  versionMetadata: {
    id: "68795d3e3ec03f0007deb52c",
    author: "sophie.stadler",
    isPatch: true,
    message:
      "'evergreen-ci/ui' pull request #940 by sophstad: DEVPROD-19315: Stabilize useQueryParam hooks (https://github.com/evergreen-ci/ui/pull/940)",
    order: 2894,
    project: "65f08ccac9ec449f57b4015d",
    projectIdentifier: "evergreen-ui",
    revision: "da7ae2020c5af16fdc5daf95a6420b36ec742a06",
    __typename: "Version",
  },
};
