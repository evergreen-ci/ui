import { Disclaimer } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import {
  BaseTable,
  LGColumnDef,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { DisplayModal } from "components/DisplayModal";
import { costDocumentationUrl } from "constants/externalResources";
import {
  getHoneycombTaskCostUrl,
  getHoneycombVersionCostUrl,
} from "constants/externalResources/honeycomb";
import { Cost } from "gql/generated/types";
import { formatCost } from "utils/numbers";
import styles from "./index.module.css";

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
  childPatchesTotalCost?: number | null;
  /** End timestamp used to bound the Honeycomb cost query time range. */
  endTs?: Date;
  /** Display name shown in the modal title, e.g. task display name */
  name: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Start timestamp used to bound the Honeycomb cost query time range. */
  startTs?: Date;
  taskId?: string;
  versionId?: string;
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
        <span className={styles.tabularNum}>
          {cost != null && cost > 0 ? `$${formatCost(cost)}` : "N/A"}
        </span>
      );
    },
  },
];

export const CostModal: React.FC<CostModalProps> = ({
  adjustedEBSStorageCost,
  adjustedEBSThroughputCost,
  adjustedEC2Cost,
  adjustedS3ArtifactPutCost,
  adjustedS3ArtifactStorageCost,
  adjustedS3LogPutCost,
  adjustedS3LogStorageCost,
  childPatchesTotalCost,
  endTs,
  name,
  open,
  setOpen,
  startTs,
  taskId,
  total,
  versionId,
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
    ...(childPatchesTotalCost != null
      ? [{ category: "Child Patches", cost: childPatchesTotalCost }]
      : []),
  ];

  const table = useLeafyGreenTable<CostRow>({
    columns,
    data: rows,
    enableColumnFilters: false,
    enableSorting: false,
  });

  return (
    <DisplayModal
      data-testid="cost-modal"
      open={open}
      setOpen={setOpen}
      title={`Cost breakdown for ${name}`}
    >
      <div className={styles.content}>
        <StyledLink hideExternalIcon={false} href={costDocumentationUrl}>
          Evergreen cost documentation
        </StyledLink>
        <BaseTable data-testid="cost-breakdown-table" table={table} />
        {taskId && startTs && endTs && (
          <StyledLink
            data-testid="task-cost-link"
            hideExternalIcon={false}
            href={getHoneycombTaskCostUrl(taskId, startTs, endTs)}
          >
            Cost breakdown in Honeycomb
          </StyledLink>
        )}
        {versionId && startTs && endTs && (
          <StyledLink
            data-testid="version-cost-link"
            hideExternalIcon={false}
            href={getHoneycombVersionCostUrl(versionId, startTs, endTs)}
          >
            Cost breakdown in Honeycomb
          </StyledLink>
        )}
        <Disclaimer>
          * Costs are calculated using a Finance Team formula with applicable
          discounts applied.
        </Disclaimer>
      </div>
    </DisplayModal>
  );
};
