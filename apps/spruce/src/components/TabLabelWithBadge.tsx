import styled from "@emotion/styled";
import { Badge, Variant } from "@leafygreen-ui/badge";
import { size } from "@evg-ui/lib/constants/tokens";

interface Props {
  tabLabel: string;
  badgeText: string | number;
  badgeVariant: Variant;
  dataTestIdBadge?: string;
}
export const TabLabelWithBadge: React.FC<Props> = ({
  badgeText,
  badgeVariant,
  dataTestIdBadge,
  tabLabel,
}) => (
  <>
    {tabLabel}{" "}
    <StyledBadge data-testid={dataTestIdBadge} variant={badgeVariant}>
      {badgeText}
    </StyledBadge>
  </>
);

const StyledBadge = styled(Badge)`
  // Fix height to be consistent with text-only tabs
  height: ${size.s};
`;
