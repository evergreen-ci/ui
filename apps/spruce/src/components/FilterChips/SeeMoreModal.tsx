import { useState } from "react";
import styled from "@emotion/styled";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import { Link } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { DisplayModal } from "components/DisplayModal";
import FilterChip, { FilterChipType } from "./FilterChip";

interface SeeMoreModalProps {
  chips: FilterChipType[];
  notVisibleCount: number;
  onRemoveChip: (chip: FilterChipType) => void;
  onClearAll: () => void;
  showValueOnly: boolean;
  truncateChipLength: number;
}
export const SeeMoreModal: React.FC<SeeMoreModalProps> = ({
  chips,
  notVisibleCount,
  onClearAll,
  onRemoveChip,
  showValueOnly,
  truncateChipLength,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
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
        <ChipContainer>
          {chips.map((c) => (
            <FilterChip
              key={`filter_chip_${c.key}_${c.value}`}
              chip={c}
              onClose={() => onRemoveChip(c)}
              showValueOnly={showValueOnly}
              truncateChipLength={truncateChipLength}
            />
          ))}
        </ChipContainer>
        <Button
          onClick={onClearAll}
          size={Size.XSmall}
          variant={Variant.Default}
        >
          Clear all
        </Button>
      </DisplayModal>
    </>
  );
};

const ChipContainer = styled.div`
  display: flex;
  gap: ${size.xs};
  flex-wrap: wrap;
  margin: ${size.s} 0;
`;
