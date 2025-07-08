import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { size } from "@evg-ui/lib/constants/tokens";
import FormChip, { FormChipType } from "./FormChip";
import { SeeMoreModal } from "./FormChipModal";

interface FormChipsProps {
  chips: FormChipType[];
  onRemove?: (chip: FormChipType) => void;
  onClearAll?: () => void;
}
const FormChips: React.FC<FormChipsProps> = ({
  chips,
  onClearAll = () => {},
  onRemove = () => {},
}) => {
  const handleOnRemove = (chip: FormChipType) => {
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
        <FormChip
          key={`form_chip_${c.key}_${c.value}`}
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
          data-cy="clear-filters"
          onClick={handleClearAll}
          size="xsmall"
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

export default FormChips;
