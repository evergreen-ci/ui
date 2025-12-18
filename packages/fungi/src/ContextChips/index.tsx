import styled from "@emotion/styled";
import { IconButton } from "@leafygreen-ui/icon-button";
import { RichLink } from "@lg-chat/rich-links";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { ContextChip } from "../Context/context";

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
    {chips.map((chip) => (
      <SingleChip
        key={chip.identifier}
        data-cy={chip.identifier}
        data-dismissible={dismissible}
      >
        <RichLink
          // @ts-expect-error: The types aren't exported from LG
          badgeColor={chip.badgeColor ?? "purple"}
          badgeLabel={chip.badgeLabel}
          variant={chip.badgeVariant ?? "Code"}
        >
          {chip.content}
        </RichLink>
        {dismissible && (
          <StyledIconButton
            aria-label="Dismiss chip"
            onClick={() => onDismiss?.(chip)}
          >
            <Icon glyph="X" onClick={() => onDismiss?.(chip)} />
          </StyledIconButton>
        )}
      </SingleChip>
    ))}
  </ChipContainer>
);

const SingleChip = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
  width: inherit;

  // Overwrite badge styling for RichLink; it's not possible to style RichLink directly.
  > div > div {
    flex-shrink: 0;
  }
`;

const StyledIconButton = styled(IconButton)``;

const ChipContainer = styled.div<{ dismissible: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};

  ${({ dismissible }) =>
    dismissible ? `width: calc(100% - ${size.s} * 2);` : `width: 100%;`}
  ${({ dismissible }) => dismissible && `padding: ${size.xs} 0;`}
`;
