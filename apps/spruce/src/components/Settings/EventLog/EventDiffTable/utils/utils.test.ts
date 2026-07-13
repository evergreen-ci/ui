import { diff } from "deep-object-diff";
import {
  formatArrayElements,
  getArrayDiff,
  getArrayDiffIndices,
  getChangedPaths,
  getEventDiffLines,
} from ".";

describe("formatArrayElements", () => {
  it("matches on numbers indicating array position", () => {
    expect(formatArrayElements("foo.1.bar")).toEqual("foo[1].bar");
  });

  it("matches on array elements that end the string", () => {
    expect(formatArrayElements("admins.1")).toEqual("admins[1]");
    expect(formatArrayElements("admins.12")).toEqual("admins[12]");
  });

  it("does not match on numbers in variable names", () => {
    expect(formatArrayElements("foo.test123")).toEqual("foo.test123");
  });
});

describe("getChangedPaths", () => {
  it("returns changed top-level keys", () => {
    const oldObj = { a: 1, b: 2 };
    const newObj = { a: 1, b: 3 };
    const result = diff(oldObj, newObj);

    expect(getChangedPaths(result)).toEqual(["b"]);
  });

  it("returns nested changed keys in dot notation", () => {
    const oldObj = {
      user: {
        name: "John",
        location: {
          city: "NYC",
        },
      },
    };
    const newObj = {
      user: {
        name: "Jane",
        location: {
          city: "LA",
        },
      },
    };

    const result = diff(oldObj, newObj);
    expect(getChangedPaths(result)).toEqual([
      "user.name",
      "user.location.city",
    ]);
  });

  it("returns added fields as changed paths", () => {
    const oldObj = {};
    const newObj = {
      foo: "bar",
      nested: { key: 42 },
    };

    const result = diff(oldObj, newObj);
    expect(getChangedPaths(result)).toEqual(["foo", "nested.key"]);
  });

  it("returns deleted fields as changed paths", () => {
    const oldObj = {
      foo: "bar",
      nested: { key: 42 },
    };
    const newObj = {};

    const result = diff(oldObj, newObj);
    // deep-object-diff will return the minimal set of changes
    // so we only get the top-level keys that were deleted
    expect(getChangedPaths(result)).toEqual(["foo", "nested"]);
  });

  it("returns empty array if no changes", () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
      },
    };

    const result = diff(obj, { ...obj });
    expect(getChangedPaths(result)).toEqual([]);
  });
});

const exampleAddition = {
  before: {
    __typename: "ProjectEventSettings",
    projectRef: {
      __typename: "Project",
      identifier: "viewTest",
      patchTriggerAliases: [],
    },
    vars: {
      __typename: "ProjectVars",
      vars: { newVariable: "so new" },
    },
  },
  after: {
    __typename: "ProjectEventSettings",
    projectRef: {
      __typename: "Project",
      identifier: "viewTest",
      patchTriggerAliases: [
        {
          __typename: "PatchTriggerAlias",
          alias: "newAlias",
          childProjectIdentifier: "evg",
        },
      ],
    },
    vars: {
      __typename: "ProjectVars",
      vars: { newVariable: "so new" },
    },
  },
};

const exampleUpdate = {
  before: {
    __typename: "ProjectEventSettings",
    projectRef: {
      __typename: "Project",
      identifier: "viewTest",
      patchTriggerAliases: [
        {
          __typename: "PatchTriggerAlias",
          alias: "newAlias",
          childProjectIdentifier: "evg",
        },
      ],
    },
    vars: {
      __typename: "ProjectVars",
      vars: { newVariable: "so new" },
    },
  },
  after: {
    __typename: "ProjectEventSettings",
    projectRef: {
      __typename: "Project",
      identifier: "viewTest",
      patchTriggerAliases: [
        {
          __typename: "PatchTriggerAlias",
          alias: "noLongerNewAlias",
          childProjectIdentifier: "evg",
        },
      ],
    },
    vars: {
      __typename: "ProjectVars",
      vars: { newVariable: "so new" },
    },
  },
};

const exampleDeletion = {
  before: {
    __typename: "ProjectEventSettings",
    projectRef: {
      __typename: "Project",
      identifier: "viewTest",
      patchTriggerAliases: [],
    },
    vars: {
      __typename: "ProjectVars",
      vars: { newVariable: "so new" },
    },
  },
  after: {
    __typename: "ProjectEventSettings",
    projectRef: {
      __typename: "Project",
      identifier: "viewTest",
      patchTriggerAliases: [],
    },
    vars: {
      __typename: "ProjectVars",
      vars: {},
    },
  },
};

describe("getEventDiffLines", () => {
  it("should transform updates", () => {
    const diffLines = getEventDiffLines(
      exampleUpdate.before,
      exampleUpdate.after,
    );
    expect(diffLines).toStrictEqual([
      {
        key: "projectRef.patchTriggerAliases[0].alias",
        before: "newAlias",
        after: "noLongerNewAlias",
      },
    ]);
  });
  it("should transform additions", () => {
    const diffLines = getEventDiffLines(
      exampleAddition.before,
      exampleAddition.after,
    );
    expect(diffLines).toStrictEqual([
      {
        key: "projectRef.patchTriggerAliases[0]",
        before: undefined,
        after: {
          alias: "newAlias",
          childProjectIdentifier: "evg",
        },
      },
    ]);
  });
  it("should transform deletions", () => {
    const diffLines = getEventDiffLines(
      exampleDeletion.before,
      exampleDeletion.after,
    );
    expect(diffLines).toStrictEqual([
      {
        key: "vars.vars.newVariable",
        before: "so new",
        after: undefined,
      },
    ]);
  });

  it("collapses shifted array values into one row", () => {
    const before = {
      projectRef: {
        admins: ["jonathan.brill", "annie.black", "mohamed.khelif"],
      },
    };
    const after = {
      projectRef: {
        admins: ["bynn.lee", "jonathan.brill", "annie.black", "mohamed.khelif"],
      },
    };

    expect(getEventDiffLines(before, after)).toStrictEqual([
      {
        key: "projectRef.admins",
        before: before.projectRef.admins,
        after: after.projectRef.admins,
      },
    ]);
  });

  it("splits changes within matched array objects into leaf rows", () => {
    const before = {
      aliases: [{ name: "alias", project: "spruce" }],
    };
    const after = {
      aliases: [{ name: "alias", project: "evergreen" }],
    };

    expect(getEventDiffLines(before, after)).toStrictEqual([
      {
        key: "aliases[0].project",
        before: "spruce",
        after: "evergreen",
      },
    ]);
  });

  it("aligns nested object arrays and returns only their meaningful changes", () => {
    const before = {
      subscriptions: [
        {
          id: "subscription",
          regexSelectors: [{ data: "deploy", type: "display-name" }],
          selectors: [{ data: "gitter_request", type: "project" }],
          triggerData: { requester: "gitter_request" },
        },
      ],
    };
    const after = {
      subscriptions: [
        {
          id: "subscription",
          regexSelectors: [],
          selectors: [{ data: "git_tag_request", type: "project" }],
          triggerData: { requester: "git_tag_request" },
        },
      ],
    };

    expect(getEventDiffLines(before, after)).toStrictEqual([
      {
        key: "subscriptions[0].regexSelectors[0]",
        before: { data: "deploy", type: "display-name" },
        after: undefined,
      },
      {
        key: "subscriptions[0].selectors[0].data",
        before: "gitter_request",
        after: "git_tag_request",
      },
      {
        key: "subscriptions[0].triggerData.requester",
        before: "gitter_request",
        after: "git_tag_request",
      },
    ]);
  });

  it("ignores shifted object entries while retaining their nested updates", () => {
    const before = {
      items: [
        { id: "a", value: "old" },
        { id: "b", value: "unchanged" },
      ],
    };
    const after = {
      items: [
        { id: "new", value: "added" },
        { id: "a", value: "new" },
        { id: "b", value: "unchanged" },
      ],
    };

    expect(getEventDiffLines(before, after)).toStrictEqual([
      {
        key: "items[1].value",
        before: "old",
        after: "new",
      },
      {
        key: "items[0]",
        before: undefined,
        after: { id: "new", value: "added" },
      },
    ]);
  });
});

describe("getArrayDiffIndices", () => {
  it("identifies an insertion without marking shifted values", () => {
    expect(
      getArrayDiffIndices(["a", "b", "c"], ["new", "a", "b", "c"]),
    ).toStrictEqual({
      before: [],
      after: [0],
    });
  });

  it("identifies a removal without marking shifted values", () => {
    expect(getArrayDiffIndices(["a", "b", "c"], ["a", "c"])).toStrictEqual({
      before: [1],
      after: [],
    });
  });

  it("marks a moved value on both sides", () => {
    expect(getArrayDiffIndices(["a", "b", "c"], ["b", "a", "c"])).toStrictEqual(
      {
        before: [0],
        after: [1],
      },
    );
  });

  it("handles duplicate values deterministically", () => {
    expect(getArrayDiffIndices(["a", "b", "a"], ["a", "a"])).toStrictEqual({
      before: [1],
      after: [],
    });
  });

  it("compares object values using deep equality", () => {
    expect(
      getArrayDiffIndices(
        [{ name: "a" }, { name: "b" }],
        [{ name: "new" }, { name: "a" }, { name: "b" }],
      ),
    ).toStrictEqual({
      before: [],
      after: [0],
    });
  });

  it("pairs modified objects with matching identities", () => {
    expect(
      getArrayDiff(
        [{ id: "subscription", trigger: "patch" }],
        [{ id: "subscription", trigger: "git_tag_request" }],
      ).matches,
    ).toContainEqual({
      beforeIndex: 0,
      afterIndex: 0,
    });
  });

  it("pairs a single modified object without an identity field", () => {
    expect(
      getArrayDiff([{ trigger: "patch" }], [{ trigger: "git_tag_request" }])
        .matches,
    ).toContainEqual({
      beforeIndex: 0,
      afterIndex: 0,
    });
  });
});
