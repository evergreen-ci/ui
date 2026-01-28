const patchData = {
  activated: true,
  alias: "__github",
  author: "mohamed.khelif",
  authorDisplayName: "Mohamed Khelif",
  createTime: new Date("2024-06-25T20:58:39.862Z"),
  description:
    "'evergreen-ci/ui' pull request #206 by khelif96: DEVPROD-8367 Update analytics event names for annotation actions (https://github.com/evergreen-ci/ui/pull/206)",
  hidden: false,
  id: "667b2f7f7a878200076f23d1",
  projectIdentifier: "evergreen-ui",
  projectMetadata: {
    id: "123456",
    owner: "evergreen-ci",
    repo: "ui",
  },
  status: "failed",
  user: {
    __typename: "User" as const,
    userId: "mohamed.khelif",
    displayName: "Mohamed Khelif",
  },
  versionFull: {
    id: "667b2f7f7a878200076f23d1",
    status: "failed",
    requester: "patch_request",
    taskStatusStats: {
      counts: [
        {
          count: 1,
          status: "failed",
        },
        {
          count: 8,
          status: "success",
        },
      ],
    },
  },
};

export { patchData };
