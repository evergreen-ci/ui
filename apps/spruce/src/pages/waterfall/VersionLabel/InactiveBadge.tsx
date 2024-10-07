import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { size } from "constants/tokens";

export const InactiveBadge = () => (
  <StyledBadge variant={Variant.LightGray}>Inactive</StyledBadge>
);

const StyledBadge = styled(Badge)`
  margin-left: ${size.xs};
`;
