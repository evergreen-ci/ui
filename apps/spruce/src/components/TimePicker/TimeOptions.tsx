import styled from "@emotion/styled";
import { DateType } from "@leafygreen-ui/date-utils";
import { palette } from "@leafygreen-ui/palette";
import { size, transitionDuration } from "@evg-ui/lib/constants/tokens";
import { TimepickerType } from "./types";
import { scrollToIdx } from "./utils";

const { blue, gray } = palette;

interface TimePickerOptionsProps {
  "data-cy": string;
  scrollContainerId: string;
  value: string;
  onDateChange: (newDate: DateType) => void;
  options: string[];
  type: TimepickerType;
  currentDateTime: Date;
}

const TimePickerOptions: React.FC<TimePickerOptionsProps> = ({
  currentDateTime,
  "data-cy": dataCy,
  onDateChange,
  options,
  scrollContainerId,
  type,
  value,
}) => (
  <TimeOptions data-cy={dataCy} id={scrollContainerId}>
    {options.map((o, idx) => (
      <TimePickerOption
        key={`${scrollContainerId}-${o}`}
        index={idx}
        isSelected={value === o}
        onSelectOption={(val) => {
          const valAsNumber = Number(val);
          if (type === TimepickerType.Minute) {
            currentDateTime.setMinutes(valAsNumber);
          } else if (type === TimepickerType.Hour) {
            currentDateTime.setHours(valAsNumber);
          }
          onDateChange(currentDateTime);
        }}
        scrollContainerId={scrollContainerId}
        value={o}
      />
    ))}
  </TimeOptions>
);

const TimeOptions = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  scrollbar-width: none;
`;

interface TimePickerOptionProps {
  value: string;
  onSelectOption: (value: string) => void;
  isSelected: boolean;
  index: number;
  scrollContainerId: string;
}

const TimePickerOption: React.FC<TimePickerOptionProps> = ({
  index,
  isSelected,
  onSelectOption,
  scrollContainerId,
  value,
}) => (
  <Item
    id={`time-picker-${value}`}
    onClick={(e) => {
      e.stopPropagation();
      onSelectOption(value);
      scrollToIdx(scrollContainerId, index, "smooth");
    }}
    selected={isSelected}
    type="submit"
  >
    {value}
  </Item>
);

const Item = styled.button<{ selected: boolean }>`
  all: unset;
  padding: ${size.xs} 20px;
  cursor: pointer;

  :hover {
    ${({ selected }) => !selected && `background-color: ${gray.light2}`};
  }
  ${({ selected }) => selected && `background-color: ${blue.light3}`};
  transition: background-color ${transitionDuration.default}ms ease-in-out;
`;

export default TimePickerOptions;
