import styled from "@emotion/styled";
import { IconButton } from "@leafygreen-ui/icon-button";
import { RichLink } from "@lg-chat/rich-links";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { ContextChip } from "../Context/context";

export type ContextChipsProps = {
  chips: ContextChip[];
  onDismiss: (chip: ContextChip) => void;
};

export const ContextChips: React.FC<ContextChipsProps> = ({
  chips,
  onDismiss,
}) => (
  <ChipContainer>
    {chips.map((chip) => (
      <SingleChip key={chip.identifier} data-cy={chip.identifier}>
        <RichLink
          // @ts-expect-error: The types aren't exported from LG
          badgeColor={chip.badgeColor ?? "grey"}
          badgeLabel={chip.badgeLabel}
          variant={chip.variant}
        >
          {chip.children}
        </RichLink>
        <IconButton aria-label="Dismiss chip" onClick={() => onDismiss?.(chip)}>
          <Icon glyph="X" onClick={() => onDismiss?.(chip)} />
        </IconButton>
      </SingleChip>
    ))}
  </ChipContainer>
);

const SingleChip = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};

  // Overwrite badge styling for RichLink; it's not possible to style RichLink directly.
  > div > div {
    flex-shrink: 0;
  }
`;

const ChipContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: ${size.xs};
  width: 90%;

  padding: ${size.xs} ${size.s};
`;
