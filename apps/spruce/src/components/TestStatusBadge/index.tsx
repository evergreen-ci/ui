import Badge, { Variant } from "@leafygreen-ui/badge";
import { TestStatus } from "@evg-ui/lib/types/test";
import { statusToBadgeColor, statusCopy } from "./constants";

interface TestStatusBadgeProps {
  status: TestStatus;
}

const TestStatusBadge: React.FC<TestStatusBadgeProps> = ({ status }) => (
  <Badge
    key={status}
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variant={statusToBadgeColor[status?.toLowerCase()] || Variant.LightGray}
  >
    {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
    {statusCopy[status?.toLowerCase()] || status}
  </Badge>
);

export default TestStatusBadge;
