import { ApolloMock } from "@evg-ui/lib/test_utils";
import { TaskStatus } from "@evg-ui/lib/types";
import {
  TaskStatusesQuery,
  TaskStatusesQueryVariables,
} from "gql/generated/types";
import { TASK_STATUSES } from "gql/queries";

const versionId = "version-1234";

export const taskStatusesMock: ApolloMock<
  TaskStatusesQuery,
  TaskStatusesQueryVariables
> = {
  request: {
    query: TASK_STATUSES,
    variables: { id: versionId },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        id: versionId,
        baseTaskStatuses: [TaskStatus.Failed, TaskStatus.Unscheduled],
        taskStatuses: [TaskStatus.Started, TaskStatus.Succeeded],
      },
    },
  },
};

export const versionTasks = {
  data: {
    version: {
      id: "6864459c5b88310007596035",
      isPatch: true,
      tasks: {
        count: 10,
        data: [
          {
            id: "evergreen_ui_spruce_snapshots_patch_26012f78a3769aad078554f89d1de580a312d629_6864459c5b88310007596035_25_07_01_20_31_25",
            aborted: false,
            baseTask: {
              id: "evergreen_ui_spruce_snapshots_26012f78a3769aad078554f89d1de580a312d629_25_07_01_16_16_27",
              displayStatus: "success",
              execution: 0,
              __typename: "Task",
            },
            blocked: false,
            buildVariant: "spruce",
            buildVariantDisplayName: "Spruce",
            dependsOn: null,
            displayName: "snapshots",
            displayStatus: "failed",
            execution: 0,
            executionTasksFull: null,
            projectIdentifier: "evergreen-ui",
            __typename: "Task",
          },
          {
            id: "evergreen_ui_spruce_test_patch_26012f78a3769aad078554f89d1de580a312d629_6864459c5b88310007596035_25_07_01_20_31_25",
            aborted: false,
            baseTask: {
              id: "evergreen_ui_spruce_test_26012f78a3769aad078554f89d1de580a312d629_25_07_01_16_16_27",
              displayStatus: "success",
              execution: 0,
              __typename: "Task",
            },
            blocked: false,
            buildVariant: "spruce",
            buildVariantDisplayName: "Spruce",
            dependsOn: null,
            displayName: "test",
            displayStatus: "success",
            execution: 0,
            executionTasksFull: null,
            projectIdentifier: "evergreen-ui",
            __typename: "Task",
          },
          {
            id: "evergreen_ui_spruce_type_check_patch_26012f78a3769aad078554f89d1de580a312d629_6864459c5b88310007596035_25_07_01_20_31_25",
            aborted: false,
            baseTask: {
              id: "evergreen_ui_spruce_type_check_26012f78a3769aad078554f89d1de580a312d629_25_07_01_16_16_27",
              displayStatus: "success",
              execution: 0,
              __typename: "Task",
            },
            blocked: false,
            buildVariant: "spruce",
            buildVariantDisplayName: "Spruce",
            dependsOn: null,
            displayName: "type_check",
            displayStatus: "success",
            execution: 0,
            executionTasksFull: null,
            projectIdentifier: "evergreen-ui",
            __typename: "Task",
          },
          {
            id: "evergreen_ui_spruce_display_e2e_parallel_patch_26012f78a3769aad078554f89d1de580a312d629_6864459c5b88310007596035_25_07_01_20_31_25",
            aborted: false,
            baseTask: null,
            blocked: false,
            buildVariant: "spruce",
            buildVariantDisplayName: "Spruce",
            dependsOn: null,
            displayName: "e2e_parallel",
            displayStatus: "failed",
            execution: 0,
            executionTasksFull: [
              {
                id: "evergreen_ui_spruce_e2e_spruce_0_patch_26012f78a3769aad078554f89d1de580a312d629_6864459c5b88310007596035_25_07_01_20_31_25",
                baseTask: null,
                buildVariant: "spruce",
                buildVariantDisplayName: "Spruce",
                displayName: "e2e_spruce_0",
                displayStatus: "failed",
                execution: 0,
                projectIdentifier: "evergreen-ui",
                __typename: "Task",
              },
              {
                id: "evergreen_ui_spruce_e2e_spruce_1_patch_26012f78a3769aad078554f89d1de580a312d629_6864459c5b88310007596035_25_07_01_20_31_25",
                baseTask: null,
                buildVariant: "spruce",
                buildVariantDisplayName: "Spruce",
                displayName: "e2e_spruce_1",
                displayStatus: "failed",
                execution: 0,
                projectIdentifier: "evergreen-ui",
                __typename: "Task",
              },
              {
                id: "evergreen_ui_spruce_e2e_spruce_2_patch_26012f78a3769aad078554f89d1de580a312d629_6864459c5b88310007596035_25_07_01_20_31_25",
                baseTask: null,
                buildVariant: "spruce",
                buildVariantDisplayName: "Spruce",
                displayName: "e2e_spruce_2",
                displayStatus: "failed",
                execution: 0,
                projectIdentifier: "evergreen-ui",
                __typename: "Task",
              },
              {
                id: "evergreen_ui_spruce_e2e_spruce_3_patch_26012f78a3769aad078554f89d1de580a312d629_6864459c5b88310007596035_25_07_01_20_31_25",
                baseTask: null,
                buildVariant: "spruce",
                buildVariantDisplayName: "Spruce",
                displayName: "e2e_spruce_3",
                displayStatus: "success",
                execution: 0,
                projectIdentifier: "evergreen-ui",
                __typename: "Task",
              },
            ],
            projectIdentifier: "evergreen-ui",
            __typename: "Task",
          },
        ],
        __typename: "VersionTasks",
      },
      __typename: "Version",
    },
  },
};
