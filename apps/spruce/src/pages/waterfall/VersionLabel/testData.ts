import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  VersionTriggerInfoQuery,
  VersionTriggerInfoQueryVariables,
} from "gql/generated/types";
import { VERSION_TRIGGER_INFO } from "gql/queries";

export type UpstreamProject = NonNullable<
  NonNullable<VersionTriggerInfoQuery["version"]>["upstreamProject"]
>;

const defaultUpstreamProject: UpstreamProject = {
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

export const getVersionTriggerInfoMock = (
  versionId: string,
  upstreamProject: UpstreamProject = defaultUpstreamProject,
): ApolloMock<VersionTriggerInfoQuery, VersionTriggerInfoQueryVariables> => ({
  request: {
    query: VERSION_TRIGGER_INFO,
    variables: { versionId },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        id: versionId,
        repotrackerBaseVersion: {
          __typename: "Version",
          id: "evergreen_ui_aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
          createTime: new Date("2024-09-19T14:56:08Z"),
          message:
            "DEVPROD-11387: The commit this trigger version was based on",
          projectMetadata: {
            __typename: "Project",
            id: "evergreen",
            owner: "evergreen-ci",
            repo: "evergreen",
          },
          revision: "aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
          user: {
            __typename: "User",
            id: "sophie.stadler",
            displayName: "Sophie Stadler",
          },
        },
        upstreamProject,
      },
    },
  },
});
