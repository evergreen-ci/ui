import {
  Chip,
  TruncationLocation,
  Variant as ChipVariant,
} from "@leafygreen-ui/chip";
import { zIndex } from "@evg-ui/lib/constants/tokens";

interface FilterChipType {
  key: string;
  title?: string;
  value: string;
}
interface FilterChipProps {
  chip: FilterChipType;
  onClose: () => void;
  showValueOnly: boolean;
  truncateChipLength: number;
}

const FilterChip: React.FC<FilterChipProps> = ({
  chip,
  onClose,
  showValueOnly,
  truncateChipLength,
}) => (
  <Chip
    chipCharacterLimit={truncateChipLength}
    chipTruncationLocation={TruncationLocation.Middle}
    data-cy="filter-chip"
    label={showValueOnly ? chip.value : `${chip.title}: ${chip.value}`}
    onDismiss={onClose}
    popoverZIndex={zIndex.tooltip}
    variant={ChipVariant.Gray}
  />
);

export default FilterChip;
export type { FilterChipType };
