import styled from "@emotion/styled";
import { Chip } from "@leafygreen-ui/chip";

const maxBadgeLength = 25;

interface FilterBadgeType {
  key: string;
  value: string;
}
interface FilterBadgeProps {
  badge: FilterBadgeType;
  onClose: () => void;
}
const FilterBadge: React.FC<FilterBadgeProps> = ({ badge, onClose }) => (
  <StyledChip
    chipCharacterLimit={maxBadgeLength}
    chipTruncationLocation="middle"
    data-cy="filter-badge"
    label={`${badge.key}: ${badge.value}`}
    onDismiss={onClose}
    variant="gray"
  />
);

// TODO: DEVPROD-12590
const StyledChip = styled(Chip)`
  span {
    font-weight: 700;
    text-transform: uppercase;
  }
`;

export default FilterBadge;
export type { FilterBadgeType };
