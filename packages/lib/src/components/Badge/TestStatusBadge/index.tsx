import { Badge, BadgeVariant } from "@via-ds/components/badge";
import { TestStatus } from "../../../types/test";

const statusToBadgeColor = {
  [TestStatus.Pass]: BadgeVariant.Success,
  [TestStatus.Fail]: BadgeVariant.Error,
  [TestStatus.SilentFail]: BadgeVariant.Info,
  [TestStatus.Skip]: BadgeVariant.Warning,
  [TestStatus.Timeout]: BadgeVariant.Error,
};

const statusToCopy = {
  [TestStatus.Pass]: "Pass",
  [TestStatus.Fail]: "Fail",
  [TestStatus.Skip]: "Skip",
  [TestStatus.SilentFail]: "Silent Fail",
  [TestStatus.Timeout]: "Timeout",
};

interface TestStatusBadgeProps {
  status?: string | null;
}

const TestStatusBadge: React.FC<TestStatusBadgeProps> = ({ status }) => {
  if (!status) {
    return null;
  }
  const testStatus = status.toLowerCase() as TestStatus;
  return (
    <Badge
      key={status}
      data-testid="test-status-badge"
      variant={statusToBadgeColor[testStatus] || BadgeVariant.Status}
    >
      {statusToCopy[testStatus] || status}
    </Badge>
  );
};

export default TestStatusBadge;
