import { useCallback, useMemo, useState } from "react";
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
  const projectId = task?.versionMetadata?.projectMetadata?.id ?? "";

  const { data } = useQuery<ProjectFiltersQuery, ProjectFiltersQueryVariables>(
    PROJECT_FILTERS,
    {
      skip: !projectId,
      variables: { projectId },
    },
  );

  const parsleyFilters = useMemo(
    () => data?.project?.parsleyFilters ?? [],
    [data?.project?.parsleyFilters],
  );

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

  const initialSelection: RowSelectionState = useMemo(
    () =>
      parsleyFilters.reduce((acc, _, index) => {
        if (isRowDisabled(index)) acc[index] = true;
        return acc;
      }, {} as RowSelectionState),
    [isRowDisabled, parsleyFilters],
  );

  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(initialSelection);

  const selectedFilters = useMemo(
    () =>
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([index]) => parsleyFilters[Number(index)])
        .filter((f): f is ParsleyFilter => f !== undefined),
    [rowSelection, parsleyFilters],
  );

  const handleConfirm = () => {
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
  };

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

  return (
    <ConfirmationModal
      cancelButtonProps={{ onClick: () => setOpen(false) }}
      confirmButtonProps={{
        children: "Apply filters",
        disabled: selectedFilters.length === 0,
        onClick: handleConfirm,
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
        disabledRowIndexes={parsleyFilters
          .map((_, index) => index)
          .filter(isRowDisabled)}
        emptyComponent={
          <TablePlaceholder
            data-cy="no-filters-message"
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

const deduplicateFilters = (existing: Filters, incoming: Filters): Filters => {
  const seen = new Set(existing.map(stringifyFilter));
  incoming.forEach((f) => seen.add(stringifyFilter(f)));
  return Array.from(seen).map(parseFilter);
};

export default ProjectFiltersModal;
