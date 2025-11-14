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
    diff: `diff --git a/src/pages/Task.tsx b/src/pages/Task.tsx
index 6e806d524..8994fd1c8 100644
--- a/src/pages/Task.tsx
+++ b/src/pages/Task.tsx
@@ -570,6 +570,8 @@ src/pages/Task.tsx`,
  },
  {
    __typename: "FileDiff",
    fileName: "src/App.tsx",
    additions: 0,
    deletions: 32,
    description: "crazy cool commit!!!",
    diff: `diff --git a/src/App.tsx b/src/App.tsx
index 6e806d524..8994fd1c8 100644
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -570,6 +570,8 @@ src/App.tsx`,
  },
  {
    __typename: "FileDiff",
    fileName: "src/pages/Patch.tsx",
    additions: 55,
    deletions: 22,
    description: "mega commit",
    diff: `diff --git a/src/pages/Patch.tsx b/src/pages/Patch.tsx
index 6e806d524..8994fd1c8 100644
--- a/src/pages/Patch.tsx
+++ b/src/pages/Patch.tsx
@@ -570,6 +570,8 @@ src/pages/Patch.tsx`,
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
      diff: `diff --git a/src/pages/Task.tsx b/src/pages/Task.tsx
index 6e806d524..8994fd1c8 100644
--- a/src/pages/Task.tsx
+++ b/src/pages/Task.tsx
@@ -570,6 +570,8 @@ src/pages/Task.tsx`,
    },
  ],
  [
    {
      __typename: "FileDiff",
      fileName: "src/App.tsx",
      additions: 0,
      deletions: 32,
      description: "crazy cool commit!!!",
      diff: `diff --git a/src/App.tsx b/src/App.tsx
index 6e806d524..8994fd1c8 100644
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -570,6 +570,8 @@ src/App.tsx`,
    },
  ],
  [
    {
      __typename: "FileDiff",
      fileName: "src/pages/Patch.tsx",
      additions: 55,
      deletions: 22,
      description: "mega commit",
      diff: `diff --git a/src/pages/Patch.tsx b/src/pages/Patch.tsx
index 6e806d524..8994fd1c8 100644
--- a/src/pages/Patch.tsx
+++ b/src/pages/Patch.tsx
@@ -570,6 +570,8 @@ src/pages/Patch.tsx`,
    },
  ],
];
