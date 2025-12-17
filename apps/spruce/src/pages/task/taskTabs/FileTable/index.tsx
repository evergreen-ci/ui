import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton, TableSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Body } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import TextInputWithValidation from "components/TextInputWithValidation";
import { TaskFilesQuery, TaskFilesQueryVariables } from "gql/generated/types";
import { TASK_FILES } from "gql/queries";
import { useErrorToast } from "hooks";
import { validateRegexp } from "utils/validators";
import GroupedFileTable from "./GroupedFileTable";
import { filterGroupedFiles } from "./utils";

interface FileTableProps {
  taskId: string;
  execution: number;
}
const FileTable: React.FC<FileTableProps> = ({ execution, taskId }) => {
  const [search, setSearch] = useState("");
  const { data, error, loading } = useQuery<
    TaskFilesQuery,
    TaskFilesQueryVariables
  >(TASK_FILES, {
    variables: {
      taskId,
      execution,
    },
  });
  useErrorToast(error, "Unable to load task files");
  const { files } = data?.task ?? {};
  const { groupedFiles = [] } = files ?? {};
  const filteredGroupedFiles = filterGroupedFiles(
    groupedFiles,
    new RegExp(search, "i"),
  );

  // We only want to show the file group name if there are multiple file groups.
  const hasMultipleFileGroups = groupedFiles.length > 1;

  return loading ? (
    <FilesTableSkeleton />
  ) : (
    <>
      <StyledSearchInput
        aria-label="Search file names"
        data-cy="file-search-input"
        onChange={(v) => setSearch(v)}
        placeholder="File name regex"
        validator={validateRegexp}
        validatorErrorMessage="Invalid regex"
      />
      {filteredGroupedFiles.length === 0 && <Body>No files found</Body>}
      {filteredGroupedFiles.map(({ files: taskFiles, taskName }) => (
        <GroupedFileTable
          key={taskName}
          files={taskFiles ?? []}
          taskName={hasMultipleFileGroups ? (taskName ?? "") : ""}
        />
      ))}
    </>
  );
};

const FilesTableSkeleton = () => (
  <>
    <Skeleton />
    <TableSkeleton numCols={1} numRows={5} />
  </>
);
const StyledSearchInput = styled(TextInputWithValidation)`
  margin-left: ${size.xxs};
  margin-bottom: ${size.m};
  width: 400px;
`;
export default FileTable;
