import { ApolloMock } from "@evg-ui/lib/test_utils";
import { UserQuery, UserQueryVariables } from "gql/generated/types";
import { USER } from "gql/queries";

export const getUserMock: ApolloMock<UserQuery, UserQueryVariables> = {
  request: {
    query: USER,
    variables: {},
  },
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "admin",
        displayName: "Evergreen Admin",
        emailAddress: "admin@evergreen.com",
        permissions: {
          canEditAdminSettings: true,
        },
      },
    },
  },
};
