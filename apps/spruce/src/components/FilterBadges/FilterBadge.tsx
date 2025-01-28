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
  title: string;
}
interface FilterBadgeProps {
  badge: FilterBadgeType;
  onClose: () => void;
}

const FilterBadge: React.FC<FilterBadgeProps> = ({ badge, onClose }) => (
  <Chip
    chipCharacterLimit={maxBadgeLength}
    chipTruncationLocation={TruncationLocation.Middle}
    data-cy="filter-badge"
    label={`${badge.title}: ${badge.value}`}
    onDismiss={onClose}
    popoverZIndex={zIndex.tooltip}
    variant={ChipVariant.Gray}
  />
);

export default FilterBadge;
export type { FilterBadgeType };
