import { ApolloMock } from "@evg-ui/lib/test_utils";
import {
  ProjectFiltersQuery,
  ProjectFiltersQueryVariables,
} from "gql/generated/types";
import { PROJECT_FILTERS } from "gql/queries";

export const projectFiltersMock: ApolloMock<
  ProjectFiltersQuery,
  ProjectFiltersQueryVariables
> = {
  request: {
    query: PROJECT_FILTERS,
    variables: {
      projectId: "spruce",
    },
  },
  result: {
    data: {
      project: {
        __typename: "Project",
        id: "spruce",
        parsleyFilters: [
          {
            __typename: "ParsleyFilter",
            caseSensitive: true,
            description: "",
            exactMatch: true,
            expression:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          },
          {
            __typename: "ParsleyFilter",
            caseSensitive: true,
            description: "This is a description",
            exactMatch: false,
            expression: "active filter",
          },
          {
            __typename: "ParsleyFilter",
            caseSensitive: false,
            description:
              "This is a longer description that spans the whole width of the modal and overflows onto the next line. This verifies that overflow text wrapping works correctly.",
            exactMatch: false,
            expression: ":D",
          },
        ],
      },
    },
  },
};

export const noFiltersMock: ApolloMock<
  ProjectFiltersQuery,
  ProjectFiltersQueryVariables
> = {
  request: {
    query: PROJECT_FILTERS,
    variables: {
      projectId: "spruce",
    },
  },
  result: {
    data: {
      project: {
        __typename: "Project",
        id: "spruce",
        parsleyFilters: null,
      },
    },
  },
};
