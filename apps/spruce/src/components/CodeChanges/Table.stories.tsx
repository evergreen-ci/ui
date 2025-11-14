import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { FileDiffsFragment } from "gql/generated/types";
import { CodeChangesTable } from "./Table";

export default {
  component: CodeChangesTable,
} satisfies CustomMeta<typeof CodeChangesTable>;

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
@@ -14,6 +14,9 @@ import { FileDiffText } from "./Badge";
 import { Diff } from "./Diff";
 
 interface CodeChangesTableProps {
+  fileDiffs: FileDiffsFragment[];
+}
+export const CodeChangesTable: React.FC<CodeChangesTableProps> = ({
   fileDiffs,
 }) => {
   const fileData = useMemo(
@@ -53,6 +56,7 @@ export const CodeChangesTable: React.FC<CodeChangesTableProps> = ({
 const columns = [
   {
     accessorKey: "fileName",
+    header: "File Name",
     meta: { width: "70%" },
     cell: ({ getValue }) => <WordBreak>{getValue()}</WordBreak>,
   },
@@ -66,6 +70,7 @@ const columns = [
     cell: ({ getValue }) => <FileDiffText type="-" value={getValue()} />,
   },
 ];
+
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
@@ -8,6 +8,15 @@ export const formatDate = (date: Date) => {
   return date.toISOString();
 };
 
+export const formatNumber = (num: number) => {
+  return num.toLocaleString();
+};
+
+export const capitalize = (str: string) => {
+  return str.charAt(0).toUpperCase() + str.slice(1);
+};
+
 export const parseDate = (dateString: string) => {
   return new Date(dateString);
 };`,
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
@@ -1,12 +1,4 @@
-import { useState } from "react";
-import { useEffect } from "react";
-import { useCallback } from "react";
-import { useMemo } from "react";
-import { ComponentA } from "./ComponentA";
-import { ComponentB } from "./ComponentB";
-import { ComponentC } from "./ComponentC";
-import { ComponentD } from "./ComponentD";
 import { useQuery } from "@apollo/client";
 import { Header } from "./Header";
 import { TaskList } from "./TaskList";`,
  },
];

export const Default: CustomStoryObj<typeof CodeChangesTable> = {
  render: (args) => <CodeChangesTable {...args} />,
  args: {
    fileDiffs: mockFileDiffs,
  },
};

export const Empty: CustomStoryObj<typeof CodeChangesTable> = {
  render: (args) => <CodeChangesTable {...args} />,
  args: {
    fileDiffs: [],
  },
};

export const SingleFile: CustomStoryObj<typeof CodeChangesTable> = {
  render: (args) => <CodeChangesTable {...args} />,
  args: {
    fileDiffs: [mockFileDiffs[0]],
  },
};

export const ManyFiles: CustomStoryObj<typeof CodeChangesTable> = {
  render: (args) => <CodeChangesTable {...args} />,
  args: {
    fileDiffs: [
      ...mockFileDiffs,
      {
        __typename: "FileDiff",
        fileName: "src/components/Button/Button.tsx",
        additions: 12,
        deletions: 1,
        description: "Add new button variants",
        diff: `diff --git a/src/components/Button/Button.tsx b/src/components/Button/Button.tsx
index 111111111..222222222 100644
--- a/src/components/Button/Button.tsx
+++ b/src/components/Button/Button.tsx
@@ -8,8 +8,17 @@ interface ButtonProps {
 }
 
 export const Button: React.FC<ButtonProps> = ({ variant, children }) => {
-  return <button className={variant}>{children}</button>;
+  const baseClass = "btn";
+  return <button className={\`\${baseClass} btn-\${variant}\`}>{children}</button>;
 };
+
+export const PrimaryButton: React.FC<ButtonProps> = ({ children }) => {
+  return <Button variant="primary">{children}</Button>;
+};
+
+export const SecondaryButton: React.FC<ButtonProps> = ({ children }) => {
+  return <Button variant="secondary">{children}</Button>;
+};
 
 export default Button;`,
      },
      {
        __typename: "FileDiff",
        fileName: "src/components/Modal/Modal.tsx",
        additions: 20,
        deletions: 1,
        description: "Update modal component",
        diff: `diff --git a/src/components/Modal/Modal.tsx b/src/components/Modal/Modal.tsx
index 333333333..444444444 100644
--- a/src/components/Modal/Modal.tsx
+++ b/src/components/Modal/Modal.tsx
@@ -15,7 +15,7 @@ export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) =>
   return (
     <div className="modal-overlay" onClick={onClose}>
       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
-        {children}
+        <div className="modal-body">{children}</div>
       </div>
     </div>
   );
@@ -25,6 +25,20 @@ export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) =>
   onClose: () => void;
   children: React.ReactNode;
 }
+
+export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
+  title,
+  message,
+  onConfirm,
+  onCancel,
+}) => {
+  return (
+    <Modal isOpen={true} onClose={onCancel}>
+      <h2>{title}</h2>
+      <p>{message}</p>
+      <button onClick={onConfirm}>Confirm</button>
+      <button onClick={onCancel}>Cancel</button>
+    </Modal>
+  );
+};
 
 export default Modal;`,
      },
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
    ],
  },
};
