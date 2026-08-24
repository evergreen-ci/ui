import { useCallback, useEffect, useMemo, useState } from "react";
import { skipToken, useQuery } from "@apollo/client/react";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
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
import { Unpacked } from "@evg-ui/lib/types/utils";
import { leaveBreadcrumb } from "@evg-ui/lib/utils/errorReporting";
import { SentryBreadcrumbTypes } from "@evg-ui/lib/utils/sentry/types";
import { useLogWindowAnalytics } from "analytics";
import { getProjectSettingsURL } from "constants/externalURLTemplates";
import { useLogContext } from "context/LogContext";
import {
  ProjectFiltersQuery,
  ProjectFiltersQueryVariables,
} from "gql/generated/types";
import { PROJECT_FILTERS } from "gql/queries";
import { useFilterParam } from "hooks/useFilterParam";
import { useTaskQuery } from "hooks/useTaskQuery";
import { Filters } from "types/logs";
import { parseFilter, stringifyFilter } from "utils/query-string";
import styles from "./index.module.css";
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
  const { execution, taskID } = logMetadata ?? {};
  const { loading: taskQueryLoading, task } = useTaskQuery({
    execution,
    taskID,
  });
  const projectId = task?.versionMetadata?.projectMetadata?.id ?? "";
  const { data, loading: projectFiltersLoading } = useQuery<
    ProjectFiltersQuery,
    ProjectFiltersQueryVariables
  >(
    PROJECT_FILTERS,
    projectId
      ? {
          variables: { projectId },
        }
      : skipToken,
  );

  const parsleyFilters = useMemo(
    () => data?.project?.parsleyFilters ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectFiltersLoading],
  );

  // A row is disabled if the filter it represents is already in the URL.
  const isRowDisabled = useCallback(
    (index: number) => {
      const parsleyFilter = parsleyFilters[index];
      if (!parsleyFilter) return false;
      const filterStr = stringifyFilter(
        convertParsleyFilterToFilter(parsleyFilter),
      );
      return filters.some((f) => stringifyFilter(f) === filterStr);
    },
    [filters, parsleyFilters],
  );

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    // Determine the initial selection of filters. If a filter is already in the URL, it should be checked.
    const initialSelection: RowSelectionState = parsleyFilters.reduce(
      (acc, _, index) => {
        if (isRowDisabled(index)) acc[index] = true;
        return acc;
      },
      {} as RowSelectionState,
    );
    setRowSelection(initialSelection);
  }, [isRowDisabled, parsleyFilters]);

  const table = useLeafyGreenTable({
    columns,
    data: parsleyFilters,
    enableColumnFilters: false,
    enableRowSelection: (row) => !isRowDisabled(row.index),
    enableSorting: false,
    hasSelectableRows: true,

    onRowSelectionChange: onChangeHandler(setRowSelection),
    state: { rowSelection },
  });

  const handleConfirm = useCallback(() => {
    const selectedFilters = table
      .getSelectedRowModel()
      .rows.map(({ original }) => original);
    const newFilters = selectedFilters.map(convertParsleyFilterToFilter);
    const deduplicated = deduplicateFilters(filters, newFilters);
    setFilters(deduplicated);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, setFilters, sendEvent]);

  const hasNewFilters = table.getSelectedRowModel().rows.length > 0;

  return (
    <ConfirmationModal
      cancelButtonProps={{ onClick: () => setOpen(false) }}
      confirmButtonProps={{
        children: "Apply filters",
        disabled: !hasNewFilters,
        onClick: handleConfirm,
      }}
      data-testid="project-filters-modal"
      open={open}
      setOpen={setOpen}
      // @ts-expect-error - size is not a valid prop for ConfirmationModal but it is valid for the underlying Modal component
      size="large"
      title="Project Filters"
    >
      <BaseTable
        disabledRowIndexes={parsleyFilters
          .map((_, index) => index)
          .filter(isRowDisabled)}
        emptyComponent={
          <TablePlaceholder
            data-testid="no-filters-message"
            glyph="MagnifyingGlass"
            message={
              <p>
                No filters found! Project filters can be defined in the{" "}
                <Link
                  href={getProjectSettingsURL(projectId, "views-and-filters")}
                >
                  project settings
                </Link>
                .
              </p>
            }
          />
        }
        loading={projectFiltersLoading || taskQueryLoading}
        rowClassName={styles.row}
        shouldAlternateRowColor
        table={table}
        verticalAlignment="top"
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
      <>
        <div
          className={styles.filterExpression}
          onClick={() => row.toggleSelected()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              row.toggleSelected();
            }
          }}
          role="button"
          tabIndex={0}
          title={getValue() as string}
        >
          {getValue() as string}
        </div>
        <Disclaimer>{row.original.description}</Disclaimer>
      </>
    ),
    header: "Expression",
    meta: {
      width: "80%",
    },
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

const deduplicateFilters = (existing: Filters, incoming: Filters): Filters => {
  const seen = new Set(existing.map(stringifyFilter));
  incoming.forEach((f) => seen.add(stringifyFilter(f)));
  return Array.from(seen).map(parseFilter);
};

export default ProjectFiltersModal;
