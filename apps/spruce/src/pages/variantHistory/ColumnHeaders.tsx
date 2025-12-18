import { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { reportError } from "@evg-ui/lib/utils/errorReporting";
import { trimStringFromMiddle } from "@evg-ui/lib/utils/string";
import { useProjectHistoryAnalytics } from "analytics/projectHistory/useProjectHistoryAnalytics";
import { context, Cell, hooks } from "components/HistoryTable";
import {
  TaskNamesForBuildVariantQuery,
  TaskNamesForBuildVariantQueryVariables,
} from "gql/generated/types";
import { TASK_NAMES_FOR_BUILD_VARIANT } from "gql/queries";
import { array } from "utils";
import { variantHistoryMaxLength as maxLength } from "./constants";

const { mapStringArrayToObject } = array;
const { ColumnHeaderCell, LabelCellContainer, LoadingCell } = Cell;
const { useHistoryTable } = context;
const { useColumns } = hooks;

interface ColumnHeadersProps {
  projectIdentifier: string;
  variantName: string;
}

const ColumnHeaders: React.FC<ColumnHeadersProps> = ({
  projectIdentifier,
  variantName,
}) => {
  const { sendEvent } = useProjectHistoryAnalytics({ page: "Variant history" });
  const dispatchToast = useToastContext();
  const hasReportedError = useRef(false);

  // Fetch the column headers from the same query used on the dropdown.
  const { data: columnData, loading } = useQuery<
    TaskNamesForBuildVariantQuery,
    TaskNamesForBuildVariantQueryVariables
  >(TASK_NAMES_FOR_BUILD_VARIANT, {
    variables: {
      projectIdentifier,
      buildVariant: variantName,
    },
  });

  // Reset error flag when project or variant changes
  useEffect(() => {
    hasReportedError.current = false;
  }, [projectIdentifier, variantName]);

  // Handle empty results
  const taskNamesForBuildVariant = columnData?.taskNamesForBuildVariant;
  useEffect(() => {
    if (columnData && !taskNamesForBuildVariant && !hasReportedError.current) {
      hasReportedError.current = true;
      reportError(new Error("No task names found for build variant")).warning();
      dispatchToast.error(`No tasks found for build variant: ${variantName}}`);
    }
  }, [columnData, taskNamesForBuildVariant, dispatchToast, variantName]);

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { columnLimit, visibleColumns } = useHistoryTable();

  const columnMap = mapStringArrayToObject(visibleColumns, "name");
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const activeColumns = useColumns(taskNamesForBuildVariant, (c) => c);

  return (
    <RowContainer>
      <LabelCellContainer />
      {activeColumns.map((vc) => {
        const cell = columnMap[vc];
        if (!cell) {
          return null;
        }
        return (
          <ColumnHeaderCell
            key={`header_cell_${vc}`}
            fullDisplayName={vc}
            onClick={() => {
              sendEvent({
                name: "Clicked column header",
              });
            }}
            trimmedDisplayName={trimStringFromMiddle(vc, maxLength)}
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
