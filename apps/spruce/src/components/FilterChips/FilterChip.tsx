import {
  Chip,
  TruncationLocation,
  Variant as ChipVariant,
} from "@leafygreen-ui/chip";
import { zIndex } from "@evg-ui/lib/constants/tokens";

const maxChipLength = 25;

interface FilterChipType {
  key: string;
  title?: string;
  value: string;
}
interface FilterChipProps {
  chip: FilterChipType;
  onClose: () => void;
  showValueOnly: boolean;
}

const FilterChip: React.FC<FilterChipProps> = ({
  chip,
  onClose,
  showValueOnly,
}) => (
  <Chip
    chipCharacterLimit={maxChipLength}
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
