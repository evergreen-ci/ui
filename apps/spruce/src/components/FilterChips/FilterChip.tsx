import {
  Chip,
  Variant as ChipVariant,
  TruncationLocation,
} from "@leafygreen-ui/chip";
import Icon, { type IconProps } from "@evg-ui/lib/components/Icon";

interface FilterChipType {
  key: string;
  glyph?: IconProps["glyph"];
  title?: string;
  value: string;
}
interface FilterChipProps {
  chip: FilterChipType;
  glyph?: IconProps["glyph"];
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
    data-testid="filter-chip"
    glyph={chip?.glyph ? <Icon glyph={chip.glyph} /> : undefined}
    label={showValueOnly ? chip.value : `${chip.title}: ${chip.value}`}
    onDismiss={onClose}
    variant={ChipVariant.Gray}
  />
);

export default FilterChip;
export type { FilterChipType };
