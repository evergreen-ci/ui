import styled from "@emotion/styled";
import {
  Chip,
  TruncationLocation,
  Variant as ChipVariant,
} from "@leafygreen-ui/chip";
import { zIndex } from "@evg-ui/lib/constants/tokens";

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
    chipTruncationLocation={TruncationLocation.Middle}
    data-cy="filter-badge"
    label={`${badge.key}: ${badge.value}`}
    onDismiss={onClose}
    popoverZIndex={zIndex.tooltip}
    variant={ChipVariant.Gray}
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
