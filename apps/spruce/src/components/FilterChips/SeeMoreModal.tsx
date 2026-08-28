import { useState } from "react";
import { Button, Size, Variant } from "@leafygreen-ui/button";
import { Link } from "@leafygreen-ui/typography";
import { DisplayModal } from "components/DisplayModal";
import FilterChip, { FilterChipType } from "./FilterChip";
import styles from "./SeeMoreModal.module.css";

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
        data-testid="see-more-modal"
        open={open}
        setOpen={setOpen}
        size="large"
        title="Applied Filters"
      >
        <div className={styles.chipContainer}>
          {chips.map((c) => (
            <FilterChip
              key={`filter_chip_${c.key}_${c.value}`}
              chip={c}
              onClose={() => onRemoveChip(c)}
              showValueOnly={showValueOnly}
              truncateChipLength={truncateChipLength}
            />
          ))}
        </div>
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
