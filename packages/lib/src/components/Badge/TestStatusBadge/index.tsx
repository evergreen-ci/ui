import { Badge, Variant } from "@leafygreen-ui/badge";
import { TestStatus } from "../../../types/test";

const statusToBadgeColor = {
  [TestStatus.Fail]: Variant.Red,
  [TestStatus.Pass]: Variant.Green,
  [TestStatus.SilentFail]: Variant.Blue,
  [TestStatus.Skip]: Variant.Yellow,
  [TestStatus.Timeout]: Variant.Red,
};

const statusToCopy = {
  [TestStatus.Fail]: "Fail",
  [TestStatus.Pass]: "Pass",
  [TestStatus.SilentFail]: "Silent Fail",
  [TestStatus.Skip]: "Skip",
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
      data-cy="test-status-badge"
      variant={statusToBadgeColor[testStatus] || Variant.LightGray}
    >
      {statusToCopy[testStatus] || status}
    </Badge>
  );
};

export default TestStatusBadge;
