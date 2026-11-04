import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  VersionUpstreamProjectQuery,
  VersionUpstreamProjectQueryVariables,
} from "gql/generated/types";
import { VERSION_UPSTREAM_PROJECT } from "gql/queries";

export const getVersionUpstreamProjectMock: ApolloMock<
  VersionUpstreamProjectQuery,
  VersionUpstreamProjectQueryVariables
> = {
  request: {
    query: VERSION_UPSTREAM_PROJECT,
    variables: {
      versionId: "evergreen_ui_130948895a46d4fd04292e7783069918e4e7cd5a",
    },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        id: "evergreen_ui_130948895a46d4fd04292e7783069918e4e7cd5a",
        upstreamProject: {
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
        },
      },
    },
  },
};
