import styled from "@emotion/styled";
import { StyledLink } from "@evg-ui/lib/components/styles";
import {
  BaseTable,
  LGColumnDef,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { DisplayModal } from "components/DisplayModal";
import { getHoneycombTaskCostUrl } from "constants/externalResources/honeycomb";
import { Cost } from "gql/generated/types";

interface CostRow {
  category: string;
  cost: number | null | undefined;
}

type CostFields = Pick<
  Cost,
  | "adjustedEC2Cost"
  | "adjustedEBSStorageCost"
  | "adjustedEBSThroughputCost"
  | "adjustedS3ArtifactPutCost"
  | "adjustedS3ArtifactStorageCost"
  | "adjustedS3LogPutCost"
  | "adjustedS3LogStorageCost"
  | "total"
>;

interface CostModalProps extends CostFields {
  /** Display name shown in the modal title, e.g. task display name */
  name: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  taskId: string;
}

const columns: LGColumnDef<CostRow>[] = [
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ getValue }) => {
      const cost = getValue() as number | null | undefined;
      return (
        <TabularNum>{cost != null && cost > 0 ? `$${cost}` : "N/A"}</TabularNum>
      );
    },
  },
];

const TabularNum = styled.span`
  font-variant-numeric: tabular-nums;
`;

const Disclaimer = styled.p`
  font-size: 12px;
  color: #6f7584;
  margin-top: 8px;
`;

export const CostModal: React.FC<CostModalProps> = ({
  adjustedEBSStorageCost,
  adjustedEBSThroughputCost,
  adjustedEC2Cost,
  adjustedS3ArtifactPutCost,
  adjustedS3ArtifactStorageCost,
  adjustedS3LogPutCost,
  adjustedS3LogStorageCost,
  name,
  open,
  setOpen,
  taskId,
  total,
}) => {
  const rows: CostRow[] = [
    { category: "Total", cost: total },
    { category: "EC2", cost: adjustedEC2Cost },
    { category: "EBS Throughput", cost: adjustedEBSThroughputCost },
    { category: "EBS Storage", cost: adjustedEBSStorageCost },
    { category: "S3 Artifact Put", cost: adjustedS3ArtifactPutCost },
    { category: "S3 Artifact Storage", cost: adjustedS3ArtifactStorageCost },
    { category: "S3 Log Put", cost: adjustedS3LogPutCost },
    { category: "S3 Log Storage", cost: adjustedS3LogStorageCost },
  ];

  const table = useLeafyGreenTable<CostRow>({
    columns,
    data: rows,
    enableColumnFilters: false,
    enableSorting: false,
  });

  return (
    <DisplayModal
      data-cy="cost-modal"
      open={open}
      setOpen={setOpen}
      title={`Cost breakdown for ${name}`}
    >
      <span data-cy="cost-docs-link">
        Evergreen cost documentation (coming soon)
      </span>
      <BaseTable data-cy="cost-breakdown-table" table={table} />
      <StyledLink
        data-cy="task-cost-link"
        hideExternalIcon={false}
        href={getHoneycombTaskCostUrl(taskId)}
      >
        Cost breakdown in Honeycomb
      </StyledLink>
      <Disclaimer>
        * Costs are calculated using a Finance Team formula with applicable
        discounts applied.
      </Disclaimer>
    </DisplayModal>
  );
};
