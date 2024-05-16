import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton, TableSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Body } from "@leafygreen-ui/typography";
import TextInputWithValidation from "components/TextInputWithValidation";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import { TaskFilesQuery, TaskFilesQueryVariables } from "gql/generated/types";
import { TASK_FILES } from "gql/queries";
import { validateRegexp } from "utils/validators";
import GroupedFileTable from "./GroupedFileTable";
import { filterGroupedFiles } from "./utils";

interface FileTableProps {
  taskId: string;
  execution: number;
}
const FileTable: React.FC<FileTableProps> = ({ execution, taskId }) => {
  const [search, setSearch] = useState("");
  const dispatchToast = useToastContext();
  const { data, loading } = useQuery<TaskFilesQuery, TaskFilesQueryVariables>(
    TASK_FILES,
    {
      variables: {
        taskId,
        execution,
      },
      onError: (err) => {
        dispatchToast.error(`Unable to load task files: ${err}`);
      },
    },
  );
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
        placeholder="File name regex"
        onChange={(v) => setSearch(v)}
        data-cy="file-search-input"
        validator={validateRegexp}
        validatorErrorMessage="Invalid regex"
      />
      {filteredGroupedFiles.length === 0 && <Body>No files found</Body>}
      {/* @ts-ignore: FIXME. This comment was added by an automated script. */}
      {filteredGroupedFiles.map((groupedFile) => (
        <GroupedFileTable
          key={groupedFile?.taskName}
          files={groupedFile?.files}
          taskName={hasMultipleFileGroups && groupedFile?.taskName}
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
