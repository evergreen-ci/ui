import { createRef, forwardRef, useLayoutEffect } from "react";
import styled from "@emotion/styled";
import { DateType } from "@leafygreen-ui/date-utils";
import { palette } from "@leafygreen-ui/palette";
import { size, transitionDuration } from "@evg-ui/lib/constants/tokens";
import { RefMap, TimepickerType } from "./types";

const { blue, gray } = palette;

interface TimePickerOptionsProps {
  currentDateTime: Date;
  "data-cy": string;
  onDateChange: (newDate: DateType) => void;
  options: string[];
  type: TimepickerType;
  value: string;
}

const TimePickerOptions: React.FC<TimePickerOptionsProps> = ({
  currentDateTime,
  "data-cy": dataCy,
  onDateChange,
  options,
  type,
  value,
}) => {
  const optionRefs = options.reduce((acc, v) => {
    acc[v] = createRef<HTMLButtonElement>();
    return acc;
  }, {} as RefMap);

  // Scroll to the selected option when the popover opens.
  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      optionRefs[value].current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timeout);
  }, [optionRefs]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TimeOptions data-cy={dataCy}>
      {options.map((o) => (
        <TimePickerOption
          key={`${type}-${o}`}
          ref={optionRefs[o]}
          isSelected={value === o}
          onSelectOption={(val) => {
            optionRefs[o].current?.scrollIntoView({ behavior: "smooth" });
            const valAsNumber = Number(val);
            const newDate = new Date(currentDateTime);
            if (type === TimepickerType.Minute) {
              newDate.setMinutes(valAsNumber);
            } else if (type === TimepickerType.Hour) {
              newDate.setHours(valAsNumber);
            }
            onDateChange(newDate);
          }}
          value={o}
        />
      ))}
    </TimeOptions>
  );
};

const TimeOptions = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  scrollbar-width: none;
`;

interface TimePickerOptionProps {
  isSelected: boolean;
  onSelectOption: (value: string) => void;
  value: string;
}

const TimePickerOption = forwardRef<HTMLButtonElement, TimePickerOptionProps>(
  ({ isSelected, onSelectOption, value }, ref) => (
    <Item
      ref={ref}
      id={`time-picker-${value}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelectOption(value);
      }}
      selected={isSelected}
      type="button"
    >
      {value}
    </Item>
  ),
);
TimePickerOption.displayName = "TimePickerOption";

const Item = styled.button<{ selected: boolean }>`
  all: unset;
  font-family: inherit;
  padding: ${size.xs} 20px;
  cursor: pointer;

  :hover {
    ${({ selected }) => !selected && `background-color: ${gray.light2}`};
  }
  ${({ selected }) => selected && `background-color: ${blue.light3}`};
  transition: background-color ${transitionDuration.default}ms ease-in-out;
`;

export default TimePickerOptions;
