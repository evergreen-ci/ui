import { Version } from "./types";
import { groupInactiveVersions } from "./utils";

describe("groupInactiveVersions", () => {
  it("correctly groups inactive versions", () => {
    const res = groupInactiveVersions(versions, () => true);

    expect(res).toStrictEqual([
      {
        inactiveVersions: [
          {
            id: "a",
            author: "sophie.stadler",
            activated: false,
            createTime: new Date("2024-09-20T14:56:08Z"),
            errors: [],
            message: "bar",
            requester: "gitter_request",
            revision: "a",
            order: 5,
          },
        ],
        version: null,
      },
      {
        inactiveVersions: null,
        version: {
          id: "b",
          author: "sophie.stadler",
          activated: true,
          createTime: new Date("2024-09-19T14:56:08Z"),
          errors: [],
          message: "foo",
          requester: "gitter_request",
          revision: "b",
          order: 4,
        },
      },
      {
        inactiveVersions: [
          {
            id: "c",
            author: "sophie.stadler",
            activated: false,
            createTime: new Date("2024-09-19T14:56:08Z"),
            errors: [],
            message: "foo",
            requester: "gitter_request",
            revision: "c",
            order: 3,
          },
          {
            id: "d",
            author: "sophie.stadler",
            activated: false,
            createTime: new Date("2024-09-19T14:56:08Z"),
            errors: [],
            message: "foo",
            requester: "gitter_request",
            revision: "d",
            order: 2,
          },
          {
            id: "e",
            author: "sophie.stadler",
            activated: false,
            createTime: new Date("2024-09-19T14:56:08Z"),
            errors: [],
            message: "foo",
            requester: "gitter_request",
            revision: "e",
            order: 1,
          },
        ],
        version: null,
      },
      {
        inactiveVersions: null,
        version: {
          id: "f",
          author: "sophie.stadler",
          activated: true,
          createTime: new Date("2024-09-19T14:56:08Z"),
          errors: [],
          message: "foo",
          requester: "gitter_request",
          revision: "f",
          order: 0,
        },
      },
    ]);
  });

  it("correctly groups inactive versions when some do not appear in builds", () => {
    const res = groupInactiveVersions(versions, (v) => v.id !== "b");

    expect(res).toStrictEqual([
      {
        inactiveVersions: [
          {
            id: "a",
            author: "sophie.stadler",
            activated: false,
            createTime: new Date("2024-09-20T14:56:08Z"),
            errors: [],
            message: "bar",
            requester: "gitter_request",
            revision: "a",
            order: 5,
          },
          {
            id: "b",
            author: "sophie.stadler",
            activated: true,
            createTime: new Date("2024-09-19T14:56:08Z"),
            errors: [],
            message: "foo",
            requester: "gitter_request",
            revision: "b",
            order: 4,
          },
          {
            id: "c",
            author: "sophie.stadler",
            activated: false,
            createTime: new Date("2024-09-19T14:56:08Z"),
            errors: [],
            message: "foo",
            requester: "gitter_request",
            revision: "c",
            order: 3,
          },
          {
            id: "d",
            author: "sophie.stadler",
            activated: false,
            createTime: new Date("2024-09-19T14:56:08Z"),
            errors: [],
            message: "foo",
            requester: "gitter_request",
            revision: "d",
            order: 2,
          },
          {
            id: "e",
            author: "sophie.stadler",
            activated: false,
            createTime: new Date("2024-09-19T14:56:08Z"),
            errors: [],
            message: "foo",
            requester: "gitter_request",
            revision: "e",
            order: 1,
          },
        ],
        version: null,
      },
      {
        inactiveVersions: null,
        version: {
          id: "f",
          author: "sophie.stadler",
          activated: true,
          createTime: new Date("2024-09-19T14:56:08Z"),
          errors: [],
          message: "foo",
          requester: "gitter_request",
          revision: "f",
          order: 0,
        },
      },
    ]);
  });
});

const versions: Version[] = [
  {
    id: "a",
    author: "sophie.stadler",
    activated: false,
    createTime: new Date("2024-09-20T14:56:08Z"),
    errors: [],
    message: "bar",
    requester: "gitter_request",
    revision: "a",
    order: 5,
  },
  {
    id: "b",
    author: "sophie.stadler",
    activated: true,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    message: "foo",
    requester: "gitter_request",
    revision: "b",
    order: 4,
  },
  {
    id: "c",
    author: "sophie.stadler",
    activated: false,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    message: "foo",
    requester: "gitter_request",
    revision: "c",
    order: 3,
  },
  {
    id: "d",
    author: "sophie.stadler",
    activated: false,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    message: "foo",
    requester: "gitter_request",
    revision: "d",
    order: 2,
  },
  {
    id: "e",
    author: "sophie.stadler",
    activated: false,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    message: "foo",
    requester: "gitter_request",
    revision: "e",
    order: 1,
  },
  {
    id: "f",
    author: "sophie.stadler",
    activated: true,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    message: "foo",
    requester: "gitter_request",
    revision: "f",
    order: 0,
  },
];
