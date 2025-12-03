import { FileDiffsFragment } from "gql/generated/types";
import { bucketByCommit } from "./bucketByCommit";

describe("bucketByCommit", () => {
  it("returns an empty array given an empty array", () => {
    expect(bucketByCommit([])).toStrictEqual([]);
  });

  it("returns the input file diffs bucketed by commit", () => {
    expect(bucketByCommit(input)).toStrictEqual(output);
  });
});

const input: FileDiffsFragment[] = [
  {
    __typename: "FileDiff",
    fileName: "src/pages/Task.tsx",
    additions: 3,
    deletions: 0,
    description: "some other commit",
  },
  {
    __typename: "FileDiff",
    fileName: "src/App.tsx",
    additions: 0,
    deletions: 32,
    description: "crazy cool commit!!!",
  },
  {
    __typename: "FileDiff",
    fileName: "src/pages/Patch.tsx",
    additions: 55,
    deletions: 22,
    description: "mega commit",
  },
];
const output = [
  [
    {
      __typename: "FileDiff",
      fileName: "src/pages/Task.tsx",
      additions: 3,
      deletions: 0,
      description: "some other commit",
    },
  ],
  [
    {
      __typename: "FileDiff",
      fileName: "src/App.tsx",
      additions: 0,
      deletions: 32,
      description: "crazy cool commit!!!",
    },
  ],
  [
    {
      __typename: "FileDiff",
      fileName: "src/pages/Patch.tsx",
      additions: 55,
      deletions: 22,
      description: "mega commit",
    },
  ],
];
