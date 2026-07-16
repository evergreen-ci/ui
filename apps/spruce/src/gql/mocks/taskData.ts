import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskQuery } from "gql/generated/types";

export type TaskQueryType = {
  task: NonNullable<TaskQuery["task"]>;
};

export const taskQuery: TaskQueryType = {
  task: {
    __typename: "Task",
    aborted: false,
    abortInfo: null,
    activatedBy: "",
    activatedTime: null,
    ami: "ami-0c83bb0a9f48c15bf",
    annotation: null,
    baseTask: {
      __typename: "Task",
      displayStatus: "pending",
      execution: 1,
      id: "spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41",
      status: "pending",
      timeTaken: null,
      versionMetadata: {
        __typename: "VersionLite",
        id: "spruce_ubuntu1604_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41",
        revision: "e0ece5ad52ad01630bdf29f55b9382a26d6256b3",
      },
    },
    blocked: false,
    buildId: "build-12345",
    buildVariant: "ubuntu1604",
    buildVariantDisplayName: "Ubuntu 16.04",
    canAbort: false,
    canDisable: true,
    canModifyAnnotation: false,
    canOverrideDependencies: false,
    canRestart: true,
    canSchedule: false,
    canSetPriority: false,
    canUnschedule: false,
    dependsOn: [],
    details: {
      description:
        "Long description that requires use of the inline definition component. This would include details about where the task failed.",
      diskDevices: [],
      failingCommand: "Failing Command 1.1",
      failureMetadataTags: [
        "failure_tag_1",
        "failure_tag_2",
        "failure_tag_3",
        "failure_tag_4",
      ],
      oomTracker: {
        detected: false,
      },
      otherFailingCommands: [],
      status: TaskStatus.Failed,
      type: "type",
    },
    displayName: "e2e_test",
    displayStatus: "pending",
    displayTask: null,
    distroId: "ubuntu1604-small",
    estimatedStart: 1000,
    execution: 0,
    executionTasksFull: null,
    expectedDuration: 123,
    files: { __typename: "TaskFiles", fileCount: 38 },
    finishTime: null,
    generatedBy: null,
    generatedByName: null,
    hostId: "i-0e0e62799806e037d",
    id: "someTaskId",
    imageId: "ubuntu1604",
    ingestTime: null,
    latestExecution: 0,
    logs: {
      __typename: "TaskLogLinks",
      agentLogLink:
        "https://evergreen.mongodb.com/task_log_raw/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55/0?type=E",
      allLogLink:
        "https://evergreen.mongodb.com/task_log_raw/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55/0?type=ALL",
      systemLogLink:
        "https://evergreen.mongodb.com/task_log_raw/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55/0?type=S",
      taskLogLink:
        "https://evergreen.mongodb.com/task_log_raw/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55/0?type=T",
    },
    minQueuePosition: 0,
    order: 1,
    patchNumber: 417,
    priority: 0,
    project: {
      id: "spruce",
      identifier: "spruce",
      owner: "evergreen-ci",
      repo: "spruce",
      testSelection: {
        allowed: true,
      },
    },
    requester: "github_pull_request",
    resetWhenFinished: false,
    revision: "e0ece5ad52ad01630bdf29f55b9382a26d6256b3",
    spawnHostLink:
      "https://evergreen.mongodb.com/spawn?distro_id=ubuntu1604-small&task_id=spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55",
    startTime: null,
    status: "pending",
    tags: [
      "concurrency",
      "security",
      "release",
      "assigned_to_devprod_evergreen",
      "waiting_for_next_investigation_steps",
    ],
    taskCost: null,
    testSelectionEnabled: false,
    timeTaken: null,
    versionMetadata: {
      __typename: "VersionLite",
      id: "spruce_ubuntu1604_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41",
      isPatch: false,
      message: "ubuntu_e2e_task",
      order: 1,
      projectMetadata: {
        __typename: "ProjectLite",
        id: "spruce",
        identifier: "spruce",
      },
      revision: "123j9123u9123",
      user: {
        __typename: "UserLite",
        displayName: "Mohamed Khelif",
        userId: "mohamed.khelif",
      },
    },
  },
};
