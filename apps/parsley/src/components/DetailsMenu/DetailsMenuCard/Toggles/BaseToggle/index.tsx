import { forwardRef } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Toggle } from "@leafygreen-ui/toggle";
import { Disclaimer } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { DetailRow, DetailsLabel } from "../../styles";

const { gray } = palette;

interface BaseToggleProps {
  ["data-cy"]?: string;
  disabled?: boolean;
  leftLabel?: string;
  rightLabel?: string;
  label: string;
  tooltip: string;
  value: boolean;
  onChange: (checked: boolean) => void;
}

const BaseToggle = forwardRef<HTMLDivElement, BaseToggleProps>(
  (
    {
      "data-cy": dataCy,
      disabled = false,
      label,
      leftLabel = "OFF",
      onChange,
      rightLabel = "ON",
      tooltip,
      value,
    },
    ref,
  ) => (
    <DetailRow>
      <DetailsLabel label={tooltip}>{label}</DetailsLabel>
      <ToggleWrapper>
        <ToggleLabel>{leftLabel}</ToggleLabel>
        <div ref={ref}>
          <Toggle
            aria-labelledby={`${label} Toggle`}
            checked={value}
            data-cy={dataCy}
            disabled={disabled}
            onChange={onChange}
            size="small"
          />
        </div>
        <ToggleLabel>{rightLabel}</ToggleLabel>
      </ToggleWrapper>
    </DetailRow>
  ),
);

BaseToggle.displayName = "BaseToggle";

const ToggleLabel = styled(Disclaimer)`
  color: ${gray.base};
  margin: 0 ${size.xxs};
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default BaseToggle;
