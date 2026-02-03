import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants";

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
}) => (
  <StyledInput
    data-cy={dataCy}
    disabled={disabled}
    maxLength={2}
    onClick={() => setPopoverOpen(true)}
    placeholder="00"
    type="text"
    value={value}
  />
);
TimeInput.displayName = "TimeInput";

const StyledInput = styled.input`
  font-family: inherit;
  font-size: inherit;
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
