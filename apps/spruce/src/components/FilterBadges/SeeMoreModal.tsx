import { useState } from "react";
import styled from "@emotion/styled";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import { Link } from "@leafygreen-ui/typography";
import { DisplayModal } from "components/DisplayModal";
import { size } from "constants/tokens";
import FilterBadge, { FilterBadgeType } from "./FilterBadge";

interface SeeMoreModalProps {
  badges: FilterBadgeType[];
  notVisibleCount: number;
  onRemoveBadge: (badge: FilterBadgeType) => void;
  onClearAll: () => void;
}
export const SeeMoreModal: React.FC<SeeMoreModalProps> = ({
  badges,
  notVisibleCount,
  onClearAll,
  onRemoveBadge,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <Link onClick={() => setOpen((curr) => !curr)}>
        see {notVisibleCount} more
      </Link>
      <DisplayModal
        data-cy="see-more-modal"
        open={open}
        setOpen={setOpen}
        size="large"
        title="Applied Filters"
      >
        <BadgeContainer>
          {badges.map((b) => (
            <FilterBadge
              key={`filter_badge_${b.key}_${b.value}`}
              badge={b}
              onClose={() => onRemoveBadge(b)}
            />
          ))}
        </BadgeContainer>
        <Button
          onClick={onClearAll}
          size={Size.XSmall}
          variant={Variant.Default}
        >
          Clear all filters
        </Button>
      </DisplayModal>
    </>
  );
};

const BadgeContainer = styled.div`
  display: flex;
  gap: ${size.xs};
  flex-wrap: wrap;
  margin: ${size.s} 0;
`;
