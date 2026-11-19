import {
  ProjectCommitHistoryQuery,
  ProjectCommitHistoryQueryVariables,
} from "gql/generated/types";

type Version =
  ProjectCommitHistoryQuery["project"]["commits"]["versions"][number];

export const firstVersion: Version = {
  __typename: "Version",
  id: "commit-history-version-2",
  createTime: new Date("2026-11-19T12:00:00Z"),
  message: "Add project commit history",
  order: 2,
  revision: "abcdef123456",
  user: { __typename: "User", displayName: "Sophie", userId: "sophie" },
  taskStatusStats: {
    __typename: "TaskStats",
    counts: [
      { count: 3, status: "success" },
      { count: 1, status: "failed" },
      { count: 1, status: "started" },
    ],
  },
};

export const secondVersion: Version = {
  ...firstVersion,
  id: "commit-history-version-1",
  message: "An older commit",
  order: 1,
  revision: "123456abcdef",
};

export const makeCommitHistoryData = (
  versions: Version[],
  hasNextPage = false,
  projectIdentifier = "evergreen",
): ProjectCommitHistoryQuery => ({
  project: {
    __typename: "Project",
    id: projectIdentifier,
    identifier: projectIdentifier,
    commits: {
      __typename: "ProjectCommits",
      versions,
      pagination: {
        __typename: "ProjectCommitsPagination",
        hasNextPage,
        nextPageOrder: hasNextPage ? 1 : 0,
      },
    },
  },
});

export const initialVariables: ProjectCommitHistoryQueryVariables = {
  projectIdentifier: "evergreen",
  options: { limit: 50 },
};
