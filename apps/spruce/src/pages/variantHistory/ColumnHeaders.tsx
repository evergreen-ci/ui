import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { context, Cell, hooks } from "components/HistoryTable";
import { variantHistoryMaxLength as maxLength } from "constants/history";
import { getTaskHistoryRoute } from "constants/routes";
import {
  TaskNamesForBuildVariantQuery,
  TaskNamesForBuildVariantQueryVariables,
} from "gql/generated/types";
import { TASK_NAMES_FOR_BUILD_VARIANT } from "gql/queries";
import { array, string } from "utils";
import { reportError } from "utils/errorReporting";

const { mapStringArrayToObject } = array;
const { ColumnHeaderCell, LabelCellContainer, LoadingCell } = Cell;
const { useHistoryTable } = context;
const { useColumns } = hooks;
const { trimStringFromMiddle } = string;

interface ColumnHeadersProps {
  projectIdentifier: string;
  variantName: string;
}

const ColumnHeaders: React.FC<ColumnHeadersProps> = ({
  projectIdentifier,
  variantName,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Variant history" });
  const dispatchToast = useToastContext();

  // Fetch the column headers from the same query used on the dropdown.
  const { data: columnData, loading } = useQuery<
    TaskNamesForBuildVariantQuery,
    TaskNamesForBuildVariantQueryVariables
  >(TASK_NAMES_FOR_BUILD_VARIANT, {
    variables: {
      projectIdentifier,
      buildVariant: variantName,
    },
    onCompleted: ({ taskNamesForBuildVariant }) => {
      if (!taskNamesForBuildVariant) {
        reportError(
          new Error("No task names found for build variant"),
        ).warning();
        dispatchToast.error(
          `No tasks found for build variant: ${variantName}}`,
        );
      }
    },
  });

  const { taskNamesForBuildVariant } = columnData || {};
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
            link={getTaskHistoryRoute(projectIdentifier, vc)}
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
