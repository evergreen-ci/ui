import {
  Chip,
  TruncationLocation,
  Variant as ChipVariant,
} from "@leafygreen-ui/chip";
import { zIndex } from "@evg-ui/lib/constants/tokens";

const maxChipLength = 25;

interface FilterChipType {
  key: string;
  title: string;
  value?: string;
}
interface FilterChipProps {
  chip: FilterChipType;
  onClose: () => void;
  showTitleOnly: boolean;
}

const FilterChip: React.FC<FilterChipProps> = ({
  chip,
  onClose,
  showTitleOnly,
}) => (
  <Chip
    chipCharacterLimit={maxChipLength}
    chipTruncationLocation={TruncationLocation.Middle}
    data-cy="filter-chip"
    label={showTitleOnly ? chip.title : `${chip.title}: ${chip.value}`}
    onDismiss={onClose}
    popoverZIndex={zIndex.tooltip}
    variant={ChipVariant.Gray}
  />
);

export default FilterChip;
export type { FilterChipType };
