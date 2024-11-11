import styled from "@emotion/styled";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import { size } from "@evg-ui/lib/constants/tokens";
import FilterBadge, { FilterBadgeType } from "./FilterBadge";
import { SeeMoreModal } from "./SeeMoreModal";
import useFilterBadgeQueryParams from "./useFilterBadgeQueryParams";

interface FilterBadgesProps {
  badges: FilterBadgeType[];
  onRemove?: (badge: FilterBadgeType) => void;
  onClearAll?: () => void;
}
const FilterBadges: React.FC<FilterBadgesProps> = ({
  badges,
  onClearAll = () => {},
  onRemove = () => {},
}) => {
  const handleOnRemove = (badge: FilterBadgeType) => {
    onRemove(badge);
  };

  const handleClearAll = () => {
    onClearAll();
  };
  const visibleBadges = badges.slice(0, 8);
  const notVisibleCount = badges.slice(8, badges.length).length;
  return (
    <Container>
      {visibleBadges.map((p) => (
        <FilterBadge
          key={`filter_badge_${p.key}_${p.value}`}
          badge={p}
          onClose={() => {
            handleOnRemove(p);
          }}
        />
      ))}
      {badges.length > 8 && (
        <SeeMoreModal
          badges={badges}
          notVisibleCount={notVisibleCount}
          onClearAll={handleClearAll}
          onRemoveBadge={handleOnRemove}
        />
      )}
      {badges.length > 0 && (
        <Button
          data-cy="clear-all-filters"
          onClick={handleClearAll}
          size={Size.XSmall}
          variant={Variant.Default}
        >
          CLEAR ALL FILTERS
        </Button>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: ${size.xs};
  flex-wrap: wrap;

  /* height of 1 row of badges, to avoid layout shift (equal to height of XSmall button) */
  min-height: 22px;

  overflow: hidden;
`;

export default FilterBadges;
export { useFilterBadgeQueryParams };
