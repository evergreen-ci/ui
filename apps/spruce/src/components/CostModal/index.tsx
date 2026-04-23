import styled from "@emotion/styled";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { DisplayModal } from "components/DisplayModal";

export const formatCost = (cost: number): string => {
  if (cost >= 0.01) return cost.toFixed(2);
  return cost.toString();
};

const COST_DOC_URL =
  "https://docs.devprod.prod.corp.mongodb.com/evergreen/FAQ/Cost-FAQ";

interface CostRow {
  event: string;
  cost: number | null | undefined;
}

interface CostModalProps {
  /** Display name shown in the modal title, e.g. task display name */
  name: string;
  open: boolean;
  onClose: () => void;
  total?: number | null;
  adjustedEC2Cost?: number | null;
  adjustedEBSStorageCost?: number | null;
  adjustedEBSThroughputCost?: number | null;
  adjustedS3ArtifactPutCost?: number | null;
  adjustedS3ArtifactStorageCost?: number | null;
  adjustedS3LogPutCost?: number | null;
  adjustedS3LogStorageCost?: number | null;
}

export const CostModal: React.FC<CostModalProps> = ({
  adjustedEBSStorageCost,
  adjustedEBSThroughputCost,
  adjustedEC2Cost,
  adjustedS3ArtifactPutCost,
  adjustedS3ArtifactStorageCost,
  adjustedS3LogPutCost,
  adjustedS3LogStorageCost,
  name,
  onClose,
  open,
  total,
}) => {
  const rows: CostRow[] = [
    { event: "Total", cost: total },
    { event: "EC2 Instance", cost: adjustedEC2Cost },
    { event: "EBS Throughput", cost: adjustedEBSThroughputCost },
    { event: "EBS Storage", cost: adjustedEBSStorageCost },
    { event: "S3 Artifact Put", cost: adjustedS3ArtifactPutCost },
    { event: "S3 Log Put", cost: adjustedS3LogPutCost },
    { event: "S3 Artifact Storage", cost: adjustedS3ArtifactStorageCost },
    { event: "S3 Log Storage", cost: adjustedS3LogStorageCost },
  ];

  return (
    <DisplayModal
      data-cy="cost-modal"
      open={open}
      setOpen={onClose}
      title={`Cost breakdown for ${name}`}
    >
      <StyledLink data-cy="cost-docs-link" href={COST_DOC_URL}>
        View a breakdown of documented data tracked by Evergreen
      </StyledLink>
      <CostTable data-cy="cost-breakdown-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ cost, event }) => (
            <tr key={event}>
              <td>{event}</td>
              <td>
                {cost != null && cost > 0 ? `$${formatCost(cost)}` : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </CostTable>
    </DisplayModal>
  );
};

const CostTable = styled.table`
  margin-top: ${size.s};
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: ${size.xs} ${size.s};
    text-align: left;
    border-bottom: 1px solid #e8edeb;
  }

  th {
    font-weight: 600;
  }
`;
