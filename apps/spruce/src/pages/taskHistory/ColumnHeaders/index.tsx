import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { reportError } from "@evg-ui/lib/utils/errorReporting";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { context, Cell, hooks } from "components/HistoryTable";
import { taskHistoryMaxLength as maxLength } from "constants/history";
import { getVariantHistoryRoute } from "constants/routes";
import {
  BuildVariantsForTaskNameQuery,
  BuildVariantsForTaskNameQueryVariables,
} from "gql/generated/types";
import BUILD_VARIANTS_FOR_TASK_NAME from "gql/queries/build-variants-for-task-name.graphql";
import { array, string } from "utils";

const { useColumns } = hooks;
const { convertArrayToObject } = array;
const { trimStringFromMiddle } = string;
const { useHistoryTable } = context;
const { ColumnHeaderCell, LabelCellContainer, LoadingCell } = Cell;

interface ColumnHeadersProps {
  projectIdentifier: string;
  taskName: string;
}

const ColumnHeaders: React.FC<ColumnHeadersProps> = ({
  projectIdentifier,
  taskName,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Task history" });
  const dispatchToast = useToastContext();

  // Fetch the column headers from the same query used on the dropdown.
  const { data: columnData, loading } = useQuery<
    BuildVariantsForTaskNameQuery,
    BuildVariantsForTaskNameQueryVariables
  >(BUILD_VARIANTS_FOR_TASK_NAME, {
    variables: {
      projectIdentifier,
      taskName,
    },
    onCompleted: ({ buildVariantsForTaskName }) => {
      if (!buildVariantsForTaskName) {
        reportError(
          new Error("No build variants found for task name"),
        ).warning();
        dispatchToast.error(`No build variants found for task: ${taskName}`);
      }
    },
  });

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { columnLimit, visibleColumns } = useHistoryTable();
  const { buildVariantsForTaskName } = columnData || {};

  const activeColumns = useColumns(
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    buildVariantsForTaskName,
    ({ buildVariant }) => buildVariant,
  );
  const columnMap = convertArrayToObject(activeColumns, "buildVariant");
  return (
    <RowContainer>
      <LabelCellContainer />
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
      {visibleColumns.map((vc) => {
        const cell = columnMap[vc];
        if (!cell) {
          return null;
        }
        return (
          <ColumnHeaderCell
            key={`header_cell_${cell.displayName}`}
            fullDisplayName={cell.displayName}
            link={getVariantHistoryRoute(projectIdentifier, cell.buildVariant)}
            onClick={() => {
              sendEvent({
                name: "Clicked column header",
              });
            }}
            trimmedDisplayName={trimStringFromMiddle(
              cell.displayName,
              maxLength,
            )}
          />
        );
      })}
      {loading &&
        Array.from(Array(columnLimit)).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <LoadingCell key={`loading_cell_${i}`} isHeader />
        ))}
    </RowContainer>
  );
};

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export default ColumnHeaders;
