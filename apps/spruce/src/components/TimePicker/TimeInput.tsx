import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";

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
  text-align: center;
  font-variant-numeric: tabular-nums;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  width: 24px;

  :focus {
    background-color: ${blue.light3};
  }
`;

export default TimeInput;
