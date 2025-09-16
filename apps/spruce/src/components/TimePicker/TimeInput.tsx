import styled from "@emotion/styled";
import { useBaseFontSize } from "@leafygreen-ui/leafygreen-provider";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";

const { blue } = palette;

interface TimeInputProps {
  "data-cy": string;
  value: string;
  disabled: boolean;
  setPopoverOpen: (val: boolean) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({
  "data-cy": dataCy,
  disabled,
  setPopoverOpen,
  value,
}) => {
  const fontSize = useBaseFontSize();
  return (
    <StyledInput
      data-cy={dataCy}
      disabled={disabled}
      fontSize={fontSize}
      maxLength={2}
      onClick={() => setPopoverOpen(true)}
      placeholder="00"
      type="text"
      value={value}
    />
  );
};
TimeInput.displayName = "TimeInput";

const StyledInput = styled.input<{ fontSize: number }>`
  font-family: inherit;
  font-size: ${({ fontSize }) => fontSize}px;
  font-variant-numeric: tabular-nums;
  text-align: center;

  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  width: ${size.m};

  :focus {
    background-color: ${blue.light3};
  }
`;

export default TimeInput;
