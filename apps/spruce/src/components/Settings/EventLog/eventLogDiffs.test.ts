import { Subset } from "@evg-ui/lib/types/utils";
import { ProjectEventSettings } from "gql/generated/types";
import { formatArrayElements, getEventDiffLines } from "./eventLogDiffs";

const beforeAddition: Subset<ProjectEventSettings> = {
  __typename: "ProjectEventSettings",
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  projectRef: {
    __typename: "Project",
    identifier: "viewTest",
    patchTriggerAliases: [],
  },
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  vars: {
    __typename: "ProjectVars",
    vars: { newVariable: "so new" },
  },
};

const afterAddition: Subset<ProjectEventSettings> = {
  __typename: "ProjectEventSettings",
  projectRef: {
    __typename: "Project",
    identifier: "viewTest",
    patchTriggerAliases: [
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      {
        __typename: "PatchTriggerAlias",
        alias: "newAlias",
        childProjectIdentifier: "evg",
      },
    ],
  },
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  vars: {
    __typename: "ProjectVars",
    vars: { newVariable: "so new" },
  },
};

const beforeUpdate: Subset<ProjectEventSettings> = {
  __typename: "ProjectEventSettings",
  projectRef: {
    __typename: "Project",
    identifier: "viewTest",
    patchTriggerAliases: [
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      {
        __typename: "PatchTriggerAlias",
        alias: "newAlias",
        childProjectIdentifier: "evg",
      },
    ],
  },
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  vars: {
    __typename: "ProjectVars",
    vars: { newVariable: "so new" },
  },
};
const afterUpdate: Subset<ProjectEventSettings> = {
  __typename: "ProjectEventSettings",
  projectRef: {
    __typename: "Project",
    identifier: "viewTest",
    patchTriggerAliases: [
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      {
        __typename: "PatchTriggerAlias",
        alias: "noLongerNewAlias",
        childProjectIdentifier: "evg",
      },
    ],
  },
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  vars: {
    __typename: "ProjectVars",
    vars: { newVariable: "so new" },
  },
};

const beforeDeletion: Subset<ProjectEventSettings> = {
  __typename: "ProjectEventSettings",
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  projectRef: {
    __typename: "Project",
    identifier: "viewTest",
    patchTriggerAliases: [],
  },
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  vars: {
    __typename: "ProjectVars",
    vars: { newVariable: "so new" },
  },
};

const afterDeletion: Subset<ProjectEventSettings> = {
  __typename: "ProjectEventSettings",
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  projectRef: {
    __typename: "Project",
    identifier: "viewTest",
    patchTriggerAliases: [],
  },
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  vars: {
    __typename: "ProjectVars",
    vars: {},
  },
};

describe("should transform event diffs to key, before and after", () => {
  it("should transform updates", () => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const diffLines = getEventDiffLines(beforeUpdate, afterUpdate);
    expect(diffLines).toStrictEqual([
      {
        key: "projectRef.patchTriggerAliases[0].alias",
        before: "newAlias",
        after: "noLongerNewAlias",
      },
    ]);
  });
  it("should transform additions", () => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const diffLines = getEventDiffLines(beforeAddition, afterAddition);
    expect(diffLines).toStrictEqual([
      {
        key: "projectRef.patchTriggerAliases[0].alias",
        before: undefined,
        after: "newAlias",
      },
      {
        key: "projectRef.patchTriggerAliases[0].childProjectIdentifier",
        before: undefined,
        after: "evg",
      },
    ]);
  });
  it("should transform deletions", () => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const diffLines = getEventDiffLines(beforeDeletion, afterDeletion);
    expect(diffLines).toStrictEqual([
      {
        key: "vars.vars.newVariable",
        before: "so new",
        after: undefined,
      },
    ]);
  });
});

describe("formatArrayElements", () => {
  it("matches on numbers indicating array position", () => {
    expect(formatArrayElements("foo.1.bar")).toEqual("foo[1].bar");
  });

  it("matches on array elements that end the string", () => {
    expect(formatArrayElements("admins.1")).toEqual("admins[1]");
  });

  it("does not match on numbers in variable names", () => {
    expect(formatArrayElements("foo.test123")).toEqual("foo.test123");
  });
});
