import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  TaskStatusesQuery,
  TaskStatusesQueryVariables,
} from "gql/generated/types";
import { TASK_STATUSES } from "gql/queries";

export const taskStatusesMock1234: ApolloMock<
  TaskStatusesQuery,
  TaskStatusesQueryVariables
> = {
  request: {
    query: TASK_STATUSES,
    variables: {
      id: "version-1234",
    },
  },
  result: {
    data: {
      taskStatuses: [],
    },
  },
};
