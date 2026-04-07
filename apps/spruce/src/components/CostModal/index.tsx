import styled from "@emotion/styled";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { DisplayModal } from "components/DisplayModal";

export const formatCost = (cost: number | null | undefined): string => {
  if (cost == null) return "0.00";
  if (cost < 0.01) return cost.toPrecision(4);
  return cost.toFixed(2);
};

const COST_DOC_URL =
  "https://docs.devprod.prod.corp.mongodb.com/evergreen/FAQ/Cost-FAQ";

interface CostRow {
  event: string;
  cost: number | null | undefined;
}

interface CostModalProps {
  /** Display name shown in the modal title, e.g. "Patch 2451 - my patch" */
  name: string;
  open: boolean;
  onClose: () => void;
  adjustedEC2Cost?: number | null;
  adjustedEBSStorageCost?: number | null;
  adjustedEBSThroughputCost?: number | null;
  s3ArtifactPutCost?: number | null;
  s3LogPutCost?: number | null;
}

export const CostModal: React.FC<CostModalProps> = ({
  adjustedEBSStorageCost,
  adjustedEBSThroughputCost,
  adjustedEC2Cost,
  name,
  onClose,
  open,
  s3ArtifactPutCost,
  s3LogPutCost,
}) => {
  const rows: CostRow[] = [
    { event: "EC2 Instance", cost: adjustedEC2Cost },
    { event: "EBS Volume - Throughput", cost: adjustedEBSThroughputCost },
    { event: "EBS Volume - Storage", cost: adjustedEBSStorageCost },
    { event: "S3 Task Artifact Upload", cost: s3ArtifactPutCost },
    { event: "S3 Task Log Upload", cost: s3LogPutCost },
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
