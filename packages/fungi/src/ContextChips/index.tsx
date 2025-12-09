import styled from "@emotion/styled";
import { Chip, Variant as ChipVariant } from "@leafygreen-ui/chip";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { Chip as ContextChip } from "../Context/context";

export type ContextChipsProps = {
  chips: ContextChip[];
  dismissible: boolean;
  onDismiss?: (chip: ContextChip) => void;
};

export const ContextChips: React.FC<ContextChipsProps> = ({
  chips,
  dismissible,
  onDismiss,
}) => (
  <ChipContainer dismissible={dismissible}>
    {chips.map((chip) => {
      const lineRange = chip.endLine
        ? `${chip.startLine}-${chip.endLine}`
        : `${chip.startLine}`;
      const label = chip.endLine
        ? `Context: Lines ${lineRange}`
        : `Context: Line ${lineRange}`;
      return (
        <Chip
          key={lineRange}
          label={
            <>
              <Icon glyph="Code" />
              {label}
            </>
          }
          onDismiss={dismissible ? () => onDismiss?.(chip) : undefined}
          variant={ChipVariant.Purple}
        />
      );
    })}
  </ChipContainer>
);

const ChipContainer = styled.div<{ dismissible: boolean }>`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: ${size.xs};

  width: 100%;
  ${({ dismissible }) => dismissible && `padding: ${size.xs} ${size.s};`}
`;
