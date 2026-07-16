import { diff } from "deep-object-diff";
import { formatArrayElements, getChangedPaths, getEventDiffLines } from ".";

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
        location: {
          city: "NYC",
        },
        name: "John",
      },
    };
    const newObj = {
      user: {
        location: {
          city: "LA",
        },
        name: "Jane",
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
};

const exampleUpdate = {
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
};

const exampleDeletion = {
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
};

describe("getEventDiffLines", () => {
  it("should transform updates", () => {
    const diffLines = getEventDiffLines(
      exampleUpdate.before,
      exampleUpdate.after,
    );
    expect(diffLines).toStrictEqual([
      {
        after: "noLongerNewAlias",
        before: "newAlias",
        key: "projectRef.patchTriggerAliases[0].alias",
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
        after: "newAlias",
        before: undefined,
        key: "projectRef.patchTriggerAliases[0].alias",
      },
      {
        after: "evg",
        before: undefined,
        key: "projectRef.patchTriggerAliases[0].childProjectIdentifier",
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
        after: undefined,
        before: "so new",
        key: "vars.vars.newVariable",
      },
    ]);
  });
});
