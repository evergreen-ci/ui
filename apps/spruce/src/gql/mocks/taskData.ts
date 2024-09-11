import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskQuery } from "gql/generated/types";

type TaskQueryType = {
  task: NonNullable<TaskQuery["task"]>;
};

export const taskQuery: TaskQueryType = {
  task: {
    __typename: "Task",
    id: "someTaskId",
    generatedByName: null,
    generatedBy: null,
    activatedTime: null,
    abortInfo: null,
    startTime: null,
    finishTime: null,
    ingestTime: null,
    executionTasksFull: null,
    displayTask: null,
    details: {
      failingCommand: "",
      description:
        "Long description that requires use of the inline definition component. This would include details about where the task failed.",
      diskDevices: [],
      oomTracker: {
        detected: false,
      },
      status: TaskStatus.Failed,
      type: "type",
    },
    timeTaken: null,
    annotation: null,
    activatedBy: "",
    aborted: false,
    ami: "ami-0c83bb0a9f48c15bf",
    baseTask: {
      versionMetadata: {
        __typename: "Version",
        id: "spruce_ubuntu1604_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41",
        revision: "e0ece5ad52ad01630bdf29f55b9382a26d6256b3",
      },
      id: "spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41",
      execution: 1,
      timeTaken: null,
      __typename: "Task",
    },
    blocked: false,
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
    displayName: "e2e_test",
    imageId: "ubuntu1604",
    distroId: "ubuntu1604-small",
    estimatedStart: 1000,
    pod: null,
    execution: 0,
    expectedDuration: 123,
    failedTestCount: 0,
    hostId: "i-0e0e62799806e037d",
    isPerfPluginEnabled: false,
    latestExecution: 0,
    logs: {
      __typename: "TaskLogLinks",
      allLogLink:
        "https://evergreen.mongodb.com/task_log_raw/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55/0?type=ALL",
      agentLogLink:
        "https://evergreen.mongodb.com/task_log_raw/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55/0?type=E",
      eventLogLink:
        "https://evergreen.mongodb.com/event_log/task/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55",
      systemLogLink:
        "https://evergreen.mongodb.com/task_log_raw/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55/0?type=S",
      taskLogLink:
        "https://evergreen.mongodb.com/task_log_raw/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55/0?type=T",
    },
    minQueuePosition: 0,
    order: 1,
    priority: 0,
    patchNumber: 417,
    project: {
      id: "spruce",
      identifier: "spruce",
    },
    requester: "github_pull_request",
    resetWhenFinished: false,
    revision: "e0ece5ad52ad01630bdf29f55b9382a26d6256b3",
    spawnHostLink:
      "https://evergreen.mongodb.com/spawn?distro_id=ubuntu1604-small&task_id=spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55",
    status: "pending",
    files: { __typename: "TaskFiles", fileCount: 38 },
    totalTestCount: 0,
    versionMetadata: {
      __typename: "Version",
      id: "spruce_ubuntu1604_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41",
      author: "mohamed.khelif",
      isPatch: false,
      message: "ubuntu_e2e_task",
      order: 1,
      project: "spruce",
      projectIdentifier: "spruce",
      revision: "123j9123u9123",
    },
  },
};
