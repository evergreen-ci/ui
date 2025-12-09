import styled from "@emotion/styled";
import { Chip, Variant as ChipVariant } from "@leafygreen-ui/chip";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { SelectedLineRange } from "../Context/context";

export type ContextChipsProps = {
  selectedLineRanges: SelectedLineRange[];
  dismissible: boolean;
  onDismiss?: (range: SelectedLineRange) => void;
};

export const ContextChips: React.FC<ContextChipsProps> = ({
  dismissible,
  onDismiss,
  selectedLineRanges,
}) => (
  <ChipContainer dismissible={dismissible}>
    {selectedLineRanges.map((range) => {
      const lineRange = range.endLine
        ? `${range.startLine}-${range.endLine}`
        : `${range.startLine}`;
      const label = range.endLine
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
          onDismiss={dismissible ? () => onDismiss?.(range) : undefined}
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
