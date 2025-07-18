import { useState } from "react";
import { useQuery } from "@apollo/client";
import { css } from "@emotion/react";
import ConfirmationModal from "@leafygreen-ui/confirmation-modal";
import { Disclaimer } from "@leafygreen-ui/typography";
import Icon from "@evg-ui/lib/components/Icon";
import {
  BaseTable,
  LGColumnDef,
  RowSelectionState,
  onChangeHandler,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { leaveBreadcrumb } from "@evg-ui/lib/utils/errorReporting";
import { SentryBreadcrumbTypes } from "@evg-ui/lib/utils/sentry/types";
import { useLogWindowAnalytics } from "analytics";
import { CaseSensitivity, MatchType } from "constants/enums";
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
    const newFilters = selectedFilters.map((f) => ({
      ...f,
      caseSensitive: f.caseSensitive
        ? CaseSensitivity.Sensitive
        : CaseSensitivity.Insensitive,
      matchType: f.exactMatch ? MatchType.Exact : MatchType.Inverse,
      visible: true,
    }));
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

  const table = useLeafyGreenTable({
    columns,
    data: parsleyFilters ?? [],
    enableColumnFilters: false,
    enableSorting: false,
    hasSelectableRows: true,
    onRowSelectionChange: onChangeHandler<RowSelectionState>(setRowSelection),
    state: {
      rowSelection,
    },
  });
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
      <BaseTable shouldAlternateRowColor table={table} />
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
