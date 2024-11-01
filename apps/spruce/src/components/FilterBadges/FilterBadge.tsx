import styled from "@emotion/styled";
import { Chip } from "@leafygreen-ui/chip";
import Tooltip from "@leafygreen-ui/tooltip";
import ConditionalWrapper from "@evg-ui/lib/components/ConditionalWrapper";
import { size, zIndex } from "constants/tokens";
import { string } from "utils";

const { trimStringFromMiddle } = string;

const tooltipInModalZIndex = zIndex.tooltip; // necessary due to SeeMoreModal, which has zIndex 40
const maxBadgeLength = 25;

interface FilterBadgeType {
  key: string;
  value: string;
}
interface FilterBadgeProps {
  badge: FilterBadgeType;
  onClose: () => void;
}
const FilterBadge: React.FC<FilterBadgeProps> = ({ badge, onClose }) => {
  // the trimmed name needs to account for the label
  const trimmedBadgeName = trimStringFromMiddle(
    badge.value,
    maxBadgeLength - badge.key.length,
  );

  return (
    <ConditionalWrapper
      condition={trimmedBadgeName !== badge.value}
      wrapper={(children) => (
        <StyledTooltip
          align="top"
          justify="middle"
          popoverZIndex={tooltipInModalZIndex}
          trigger={children}
          triggerEvent="hover"
        >
          {badge.value}
        </StyledTooltip>
      )}
    >
      <PaddedChip
        label={
          <ChipLabel>
            {badge.key}: {trimmedBadgeName}
          </ChipLabel>
        }
        onDismiss={onClose}
        variant="gray"
      />
    </ConditionalWrapper>
  );
};

const ChipLabel = styled.span`
  text-transform: uppercase;
  font-weight: 700;
`;

const PaddedChip = styled(Chip)`
  margin-right: ${size.s};
  margin-bottom: ${size.m};
`;

// @ts-expect-error
// Reduce Tooltip padding because the default Tooltip is invasive when trying to interact with other UI elements
const StyledTooltip = styled(Tooltip)`
  padding: ${size.xxs} ${size.xs};
`;

export default FilterBadge;
export type { FilterBadgeType };
