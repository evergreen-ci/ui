import { Button, Size, Variant } from "@leafygreen-ui/button";
import FilterChip, { FilterChipType } from "./FilterChip";
import styles from "./index.module.css";
import { SeeMoreModal } from "./SeeMoreModal";
import useFilterChipQueryParams from "./useFilterChipQueryParams";

const maxChipLength = 25;

interface FilterChipsProps {
  chips: FilterChipType[];
  onRemove?: (chip: FilterChipType) => void;
  onClearAll?: () => void;
  showValueOnly?: boolean;
  truncateChipLength?: number;
}
const FilterChips: React.FC<FilterChipsProps> = ({
  chips,
  onClearAll = () => {},
  onRemove = () => {},
  showValueOnly = false,
  truncateChipLength = maxChipLength,
}) => {
  const handleOnRemove = (chip: FilterChipType) => {
    onRemove(chip);
  };
  const handleClearAll = () => {
    onClearAll();
  };
  const visibleChips = chips.slice(0, 8);
  const notVisibleCount = chips.slice(8, chips.length).length;
  return (
    <div className={styles.container}>
      {visibleChips.map((c) => (
        <FilterChip
          key={`filter_chip_${c.key}_${c.value}`}
          chip={c}
          onClose={() => {
            handleOnRemove(c);
          }}
          showValueOnly={showValueOnly}
          truncateChipLength={truncateChipLength}
        />
      ))}
      {chips.length > 8 && (
        <SeeMoreModal
          chips={chips}
          notVisibleCount={notVisibleCount}
          onClearAll={handleClearAll}
          onRemoveChip={handleOnRemove}
          showValueOnly={showValueOnly}
          truncateChipLength={truncateChipLength}
        />
      )}
      {chips.length > 0 && (
        <Button
          data-testid="clear-filters"
          onClick={handleClearAll}
          size={Size.XSmall}
          variant={Variant.Default}
        >
          Clear all
        </Button>
      )}
    </div>
  );
};

export default FilterChips;
export { useFilterChipQueryParams };
