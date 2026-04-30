import styled from "@emotion/styled";
import { Disclaimer } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import {
  BaseTable,
  LGColumnDef,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { size } from "@evg-ui/lib/constants/tokens";
import { DisplayModal } from "components/DisplayModal";
import { costDocumentationUrl } from "constants/externalResources";
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
      return <TabularNum>{cost && cost > 0 ? `$${cost}` : "N/A"}</TabularNum>;
    },
  },
];

const Content = styled.div`
  padding: ${size.xxs} 0;
`;

const TabularNum = styled.span`
  font-variant-numeric: tabular-nums;
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
      <Content>
        <StyledLink hideExternalIcon={false} href={costDocumentationUrl}>
          Evergreen cost documentation
        </StyledLink>
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
      </Content>
    </DisplayModal>
  );
};
