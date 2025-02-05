import styled from "@emotion/styled";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import { size } from "@evg-ui/lib/constants/tokens";
import FilterChip, { FilterChipType } from "./FilterChip";
import { SeeMoreModal } from "./SeeMoreModal";
import useFilterChipQueryParams from "./useFilterChipQueryParams";

interface FilterChipsProps {
  chips: FilterChipType[];
  onRemove?: (chip: FilterChipType) => void;
  onClearAll?: () => void;
}
const FilterChips: React.FC<FilterChipsProps> = ({
  chips,
  onClearAll = () => {},
  onRemove = () => {},
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
    <Container>
      {visibleChips.map((c) => (
        <FilterChip
          key={`filter_chip_${c.key}_${c.value}`}
          chip={c}
          onClose={() => {
            handleOnRemove(c);
          }}
        />
      ))}
      {chips.length > 8 && (
        <SeeMoreModal
          chips={chips}
          notVisibleCount={notVisibleCount}
          onClearAll={handleClearAll}
          onRemoveChip={handleOnRemove}
        />
      )}
      {chips.length > 0 && (
        <Button
          data-cy="clear-all-filters"
          onClick={handleClearAll}
          size={Size.XSmall}
          variant={Variant.Default}
        >
          Clear filters
        </Button>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: ${size.xs};
  flex-wrap: wrap;

  /* height of 1 row of chips, to avoid layout shift (equal to height of XSmall button) */
  min-height: 22px;

  overflow: hidden;
`;

export default FilterChips;
export { useFilterChipQueryParams };
