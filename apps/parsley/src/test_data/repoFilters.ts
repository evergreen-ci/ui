import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  RepoFiltersQuery,
  RepoFiltersQueryVariables,
} from "gql/generated/types";
import { REPO_FILTERS } from "gql/queries";

export const repoFiltersMock: ApolloMock<
  RepoFiltersQuery,
  RepoFiltersQueryVariables
> = {
  request: {
    query: REPO_FILTERS,
    variables: {
      repoRefId: "spruceRepoRef",
    },
  },
  result: {
    data: {
      repoSettings: {
        __typename: "RepoSettings",
        projectRef: {
          __typename: "RepoRef",
          id: "spruceRepoRef",
          parsleyFilters: [
            {
              __typename: "ParsleyFilter",
              caseSensitive: false,
              exactMatch: true,
              expression:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            },
          ],
        },
      },
    },
  },
};
