import { useCallback, useState } from "react";
import { useQuery } from "@apollo/client";
import { css } from "@emotion/react";
import ConfirmationModal from "@leafygreen-ui/confirmation-modal";
import { Disclaimer, Link } from "@leafygreen-ui/typography";
import Icon from "@evg-ui/lib/components/Icon";
import {
  BaseTable,
  LGColumnDef,
  RowSelectionState,
  TablePlaceholder,
  onChangeHandler,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { leaveBreadcrumb } from "@evg-ui/lib/utils/errorReporting";
import { SentryBreadcrumbTypes } from "@evg-ui/lib/utils/sentry/types";
import { useLogWindowAnalytics } from "analytics";
import { getProjectSettingsURL } from "constants/externalURLTemplates";
import { useLogContext } from "context/LogContext";
import {
  ParsleyFilter,
  ProjectFiltersQuery,
  ProjectFiltersQueryVariables,
} from "gql/generated/types";
import { PROJECT_FILTERS } from "gql/queries";
import { useFilterParam } from "hooks/useFilterParam";
import { useTaskQuery } from "hooks/useTaskQuery";
import { Filters } from "types/logs";
import { parseFilter, stringifyFilter } from "utils/query-string";
import { convertParsleyFilterToFilter } from "./utils";

interface ProjectFiltersModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ProjectFiltersModal: React.FC<ProjectFiltersModalProps> = ({
  open,
  setOpen,
}) => {
  const { sendEvent } = useLogWindowAnalytics();
  const [filters, setFilters] = useFilterParam();

  const { logMetadata } = useLogContext();
  const { buildID, execution, logType, taskID } = logMetadata ?? {};

  const { task } = useTaskQuery({ buildID, execution, logType, taskID });
  const { versionMetadata } = task ?? {};
  const { projectMetadata } = versionMetadata ?? {};

  const { data } = useQuery<ProjectFiltersQuery, ProjectFiltersQueryVariables>(
    PROJECT_FILTERS,
    {
      skip: !projectMetadata?.id,
      variables: { projectId: projectMetadata?.id ?? "" },
    },
  );
  const { project } = data || {};
  const { parsleyFilters } = project || {};
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const selectedFilters = Object.entries(rowSelection)
    .filter(([, enabled]) => enabled)
    .map(([index]) => parsleyFilters?.[Number(index)])
    .filter((f): f is ParsleyFilter => f !== undefined);

  const onConfirm = () => {
    const newFilters = selectedFilters.map((f) =>
      convertParsleyFilterToFilter(f),
    );
    const deduplicatedFilters = deduplicateFilters(filters, newFilters);
    // Apply selected filters.
    setFilters(deduplicatedFilters);

    // Send relevant tracking events.
    leaveBreadcrumb(
      "applied-project-filters",
      { filters: selectedFilters },
      SentryBreadcrumbTypes.User,
    );
    sendEvent({
      "filter.expressions": selectedFilters.map((f) => f.expression),
      name: "Used project filters",
    });
    setOpen(false);
  };

  const onCancel = () => {
    setOpen(false);
  };

  const isRowDisabled = useCallback(
    (rowIndex: number) => {
      const parsleyFilter = parsleyFilters?.[rowIndex];
      if (parsleyFilter === undefined) {
        return false;
      }
      return filters.some(
        (f) =>
          stringifyFilter(f) ===
          stringifyFilter(convertParsleyFilterToFilter(parsleyFilter)),
      );
    },
    [filters, parsleyFilters],
  );
  const table = useLeafyGreenTable({
    columns,
    data: parsleyFilters ?? [],
    enableColumnFilters: false,
    enableRowSelection: (row) => !isRowDisabled(row.index),
    enableSorting: false,
    hasSelectableRows: true,
    onRowSelectionChange: onChangeHandler<RowSelectionState>(setRowSelection),
    state: {
      rowSelection,
    },
  });

  const disabledRowIndexes =
    parsleyFilters
      ?.map((_, index) => index)
      .filter((index) => isRowDisabled(index)) ?? [];

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: onCancel,
      }}
      confirmButtonProps={{
        children: "Apply filters",
        disabled: selectedFilters.length === 0,
        onClick: onConfirm,
      }}
      css={css`
        z-index: ${zIndex.modal};
      `}
      data-cy="project-filters-modal"
      open={open}
      setOpen={setOpen}
      title="Project Filters"
    >
      <BaseTable
        disabledRowIndexes={disabledRowIndexes}
        emptyComponent={
          <TablePlaceholder
            data-cy="no-filters-message"
            glyph="MagnifyingGlass"
            message={
              <p>
                No filters found! Project filters can be defined in the{" "}
                <Link
                  href={getProjectSettingsURL(
                    projectMetadata?.id ?? "",
                    "views-and-filters",
                  )}
                >
                  project settings
                </Link>
                .
              </p>
            }
          />
        }
        shouldAlternateRowColor
        table={table}
      />
    </ConfirmationModal>
  );
};

const columns: LGColumnDef<
  Unpacked<ProjectFiltersQuery["project"]["parsleyFilters"]>
>[] = [
  {
    accessorKey: "expression",
    cell: ({ getValue, row }) => (
      <div>
        {getValue() as string}
        <Disclaimer>{row.original.description}</Disclaimer>
      </div>
    ),
    header: "Expression",
  },
  {
    accessorKey: "caseSensitive",
    cell: ({ getValue }) => getValue() === true && <Icon glyph="Checkmark" />,
    header: "Case Sensitive",
  },
  {
    accessorKey: "exactMatch",
    cell: ({ getValue }) => getValue() === true && <Icon glyph="Checkmark" />,
    header: "Exact Match",
  },
];

const deduplicateFilters = (filters: Filters, newFilters: Filters) => {
  const filterSet = new Set(filters.map((f) => stringifyFilter(f)));
  newFilters.forEach((f) => filterSet.add(stringifyFilter(f)));
  return Array.from(filterSet).map((f) => parseFilter(f));
};

export default ProjectFiltersModal;
