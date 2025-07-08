import {
  Chip,
  TruncationLocation,
  Variant as ChipVariant,
} from "@leafygreen-ui/chip";
import { zIndex } from "@evg-ui/lib/constants/tokens";

interface FormChipType {
  key: string;
  value: string;
}

interface FormChipProps {
  chip: FormChipType;
  onClose: () => void;
}

const FormChip: React.FC<FormChipProps> = ({ chip, onClose }) => (
  <Chip
    chipCharacterLimit={25}
    chipTruncationLocation={TruncationLocation.Middle}
    data-cy="form-chip"
    label={`${chip.value}`}
    onDismiss={onClose}
    popoverZIndex={zIndex.tooltip}
    variant={ChipVariant.Gray}
  />
);

export default FormChip;
export type { FormChipType };
