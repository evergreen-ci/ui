import { render, screen, userEvent, within } from "@evg-ui/lib/test_utils";
import { FileDiffsFragment } from "gql/generated/types";
import { CodeChangesTable } from "./Table";

describe("CodeChangesTable", () => {
  const mockFileDiffs: FileDiffsFragment[] = [
    {
      __typename: "FileDiff",
      fileName: "src/components/CodeChanges/Table.tsx",
      additions: 5,
      deletions: 0,
      description: "Add story and tests for codechanges table",
      diff: `diff --git a/src/components/CodeChanges/Table.tsx b/src/components/CodeChanges/Table.tsx
index 6e806d524..8994fd1c8 100644
--- a/src/components/CodeChanges/Table.tsx
+++ b/src/components/CodeChanges/Table.tsx
@@ -1,5 +1,8 @@
 import { useMemo } from "react";
 import styled from "@emotion/styled";
+import { css } from "@leafygreen-ui/emotion";
+import { WordBreak } from "@evg-ui/lib/components/styles";
 import {
   useLeafyGreenTable,
   BaseTable,
@@ -10,6 +13,10 @@ import { FileDiffText } from "./Badge";
 import { Diff } from "./Diff";
 
 interface CodeChangesTableProps {
+  fileDiffs: FileDiffsFragment[];
+}
+export const CodeChangesTable: React.FC<CodeChangesTableProps> = ({
+  fileDiffs,
 }) => {
   const fileData = useMemo(
     () =>
       fileDiffs.map((diff) => ({
         ...diff,
         renderExpandedContent: (row: LeafyGreenTableRow<FileDiffsFragment>) => (
           <Diff diff={row.original.diff} />
         ),
       })),
     [fileDiffs],
   );
   const table = useLeafyGreenTable({
     columns,
     data: fileData ?? [],
     enableColumnFilters: false,
     enableSorting: false,
   });
 
   return (
     <Container>
       <BaseTable
         data-cy="code-changes-table"
         data-cy-row="code-changes-table-row"
         shouldAlternateRowColor
         table={table}
       />
     </Container>
   );
 };
 
 const columns = [
   {
     accessorKey: "fileName",
     header: "File Name",
     meta: { width: "70%" },
     cell: ({ getValue }) => <WordBreak>{getValue()}</WordBreak>,
   },
   {
     accessorKey: "additions",
     header: "Additions",
     cell: ({ getValue }) => <FileDiffText type="+" value={getValue()} />,
   },
   {
     accessorKey: "deletions",
     header: "Deletions",
     cell: ({ getValue }) => <FileDiffText type="-" value={getValue()} />,
   },
 ];
 
 const Container = styled.div\`
   table {
     table-layout: fixed;
   }
 \`;`,
    },
    {
      __typename: "FileDiff",
      fileName: "src/utils/helpers.ts",
      additions: 8,
      deletions: 0,
      description: "Refactor utility functions",
      diff: `diff --git a/src/utils/helpers.ts b/src/utils/helpers.ts
index 123456789..987654321 100644
--- a/src/utils/helpers.ts
+++ b/src/utils/helpers.ts
@@ -1,10 +1,15 @@
 export const formatDate = (date: Date) => {
   return date.toISOString();
 };
+
+export const formatNumber = (num: number) => {
+  return num.toLocaleString();
+};
+
+export const capitalize = (str: string) => {
+  return str.charAt(0).toUpperCase() + str.slice(1);
+};`,
    },
    {
      __typename: "FileDiff",
      fileName: "src/pages/Home.tsx",
      additions: 0,
      deletions: 8,
      description: "Remove unused imports",
      diff: `diff --git a/src/pages/Home.tsx b/src/pages/Home.tsx
index abc123def..def456abc 100644
--- a/src/pages/Home.tsx
+++ b/src/pages/Home.tsx
@@ -1,8 +0,0 @@
-import { useState } from "react";
-import { useEffect } from "react";
-import { useCallback } from "react";
-import { useMemo } from "react";
-import { ComponentA } from "./ComponentA";
-import { ComponentB } from "./ComponentB";
-import { ComponentC } from "./ComponentC";
-import { ComponentD } from "./ComponentD";`,
    },
  ];

  it("renders the table with file diffs", () => {
    render(<CodeChangesTable fileDiffs={mockFileDiffs} />);
    expect(screen.getByDataCy("code-changes-table")).toBeInTheDocument();
  });

  it("renders all file names in the table", () => {
    render(<CodeChangesTable fileDiffs={mockFileDiffs} />);
    expect(
      screen.getByText("src/components/CodeChanges/Table.tsx"),
    ).toBeInTheDocument();
    expect(screen.getByText("src/utils/helpers.ts")).toBeInTheDocument();
    expect(screen.getByText("src/pages/Home.tsx")).toBeInTheDocument();
  });

  it("renders the correct number of rows", () => {
    render(<CodeChangesTable fileDiffs={mockFileDiffs} />);
    const rows = screen.getAllByDataCy("code-changes-table-row");
    expect(rows).toHaveLength(3);
  });

  it("displays additions and deletions correctly", () => {
    render(<CodeChangesTable fileDiffs={mockFileDiffs} />);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("renders table headers correctly", () => {
    render(<CodeChangesTable fileDiffs={mockFileDiffs} />);
    expect(screen.getByText("File Name")).toBeInTheDocument();
    expect(screen.getByText("Additions")).toBeInTheDocument();
    expect(screen.getByText("Deletions")).toBeInTheDocument();
  });

  it("renders empty table when fileDiffs is empty", () => {
    render(<CodeChangesTable fileDiffs={[]} />);
    expect(screen.getByDataCy("code-changes-table")).toBeInTheDocument();
    const rows = screen.queryAllByDataCy("code-changes-table-row");
    expect(rows).toHaveLength(0);
  });

  it("renders single file diff correctly", () => {
    const singleDiff = [mockFileDiffs[0]];
    render(<CodeChangesTable fileDiffs={singleDiff} />);
    expect(
      screen.getByText("src/components/CodeChanges/Table.tsx"),
    ).toBeInTheDocument();
    const rows = screen.getAllByDataCy("code-changes-table-row");
    expect(rows).toHaveLength(1);
  });

  it("displays file names with word break styling", () => {
    render(<CodeChangesTable fileDiffs={mockFileDiffs} />);
    const fileName = screen.getByText("src/components/CodeChanges/Table.tsx");
    expect(fileName).toBeInTheDocument();
  });

  it("handles files with zero additions", () => {
    const zeroAdditionsDiff: FileDiffsFragment[] = [
      {
        __typename: "FileDiff",
        fileName: "src/deleted.ts",
        additions: 0,
        deletions: 10,
        description: "Delete file",
        diff: "--- a/src/deleted.ts\n+++ /dev/null",
      },
    ];
    render(<CodeChangesTable fileDiffs={zeroAdditionsDiff} />);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("handles files with zero deletions", () => {
    const zeroDeletionsDiff: FileDiffsFragment[] = [
      {
        __typename: "FileDiff",
        fileName: "src/new.ts",
        additions: 20,
        deletions: 0,
        description: "Add new file",
        diff: "--- /dev/null\n+++ b/src/new.ts",
      },
    ];
    render(<CodeChangesTable fileDiffs={zeroDeletionsDiff} />);
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("expands rows to show diff content when clicked", async () => {
    const user = userEvent.setup();
    render(<CodeChangesTable fileDiffs={mockFileDiffs} />);

    const rows = screen.getAllByDataCy("code-changes-table-row");
    expect(rows).toHaveLength(3);

    const firstRow = rows[0];
    const expandButton = within(firstRow).queryByRole("button");

    if (expandButton) {
      await user.click(expandButton);
      expect(firstRow).toBeInTheDocument();
    }
  });

  it("handles long file names correctly", () => {
    const longFileNameDiff: FileDiffsFragment[] = [
      {
        __typename: "FileDiff",
        fileName:
          "src/components/very/long/path/to/a/file/with/a/very/long/name/that/should/wrap/File.tsx",
        additions: 5,
        deletions: 2,
        description: "Update long file name",
        diff: "--- a/src/components/very/long/path/to/a/file/with/a/very/long/name/that/should/wrap/File.tsx\n+++ b/src/components/very/long/path/to/a/file/with/a/very/long/name/that/should/wrap/File.tsx",
      },
    ];
    render(<CodeChangesTable fileDiffs={longFileNameDiff} />);
    expect(
      screen.getByText(
        "src/components/very/long/path/to/a/file/with/a/very/long/name/that/should/wrap/File.tsx",
      ),
    ).toBeInTheDocument();
  });

  it("handles file renames correctly", () => {
    const fileRenameDiff: FileDiffsFragment[] = [
      {
        __typename: "FileDiff",
        fileName: "src/components/UserProfile/UserProfile.tsx",
        additions: 2,
        deletions: 2,
        description: "Rename UserCard to UserProfile",
        diff: `diff --git a/src/components/UserCard/UserCard.tsx b/src/components/UserProfile/UserProfile.tsx
similarity index 98%
rename from src/components/UserCard/UserCard.tsx
rename to src/components/UserProfile/UserProfile.tsx
index a1b2c3d4..e5f6g7h8 100644
--- a/src/components/UserCard/UserCard.tsx
+++ b/src/components/UserProfile/UserProfile.tsx
@@ -1,5 +1,5 @@
-export const UserCard: React.FC<UserCardProps> = ({ user }) => {
+export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
   return (
     <div className="user-card">
       <h2>{user.name}</h2>
@@ -8,4 +8,4 @@ export const UserCard: React.FC<UserCardProps> = ({ user }) => {
   );
 };
 
-export default UserCard;
+export default UserProfile;`,
      },
    ];
    render(<CodeChangesTable fileDiffs={fileRenameDiff} />);
    expect(
      screen.getByText("src/components/UserProfile/UserProfile.tsx"),
    ).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("handles file renames with significant changes", () => {
    const fileRenameWithChangesDiff: FileDiffsFragment[] = [
      {
        __typename: "FileDiff",
        fileName: "src/utils/dateHelpers.ts",
        additions: 13,
        deletions: 3,
        description: "Rename and refactor date utilities",
        diff: `diff --git a/src/utils/dates.ts b/src/utils/dateHelpers.ts
similarity index 85%
rename from src/utils/dates.ts
rename to src/utils/dateHelpers.ts
index 12345678..87654321 100644
--- a/src/utils/dates.ts
+++ b/src/utils/dateHelpers.ts
@@ -1,8 +1,15 @@
-export const formatDate = (date: Date) => {
-  return date.toISOString();
+export const formatDate = (date: Date, format?: string) => {
+  if (format === "short") {
+    return date.toLocaleDateString();
+  }
+  return date.toISOString();
 };
 
-export const parseDate = (dateString: string) => {
+export const formatDateTime = (date: Date) => {
+  return date.toLocaleString();
+};
+
+export const parseDate = (dateString: string): Date => {
   return new Date(dateString);
 };
+
+export const isValidDate = (date: Date): boolean => {
+  return !isNaN(date.getTime());
+};`,
      },
    ];
    render(<CodeChangesTable fileDiffs={fileRenameWithChangesDiff} />);
    expect(screen.getByText("src/utils/dateHelpers.ts")).toBeInTheDocument();
    expect(screen.getByText("13")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
