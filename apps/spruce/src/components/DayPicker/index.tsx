import { useCallback, useState } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { transitionDuration } from "@leafygreen-ui/tokens";
import { size } from "constants/tokens";

const { gray, white } = palette;

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const emptyState = new Array(days.length).fill(false);

type DayPickerState = Array<boolean>;

/**
 * Allows selecting days of the week
 * @param props - React props
 * @param props.defaultState - optionally specifies the initial selected days
 * @param props.onChange - optionally calls a side effect function with the new selection state when a change is made
 * @returns DayPicker - DayPicker component
 */
export const DayPicker: React.FC<{
  defaultState?: DayPickerState;
  onChange?: (value: DayPickerState) => void;
}> = ({ defaultState = emptyState, onChange }) => {
  const [selectedDays, setSelectedDays] =
    useState<DayPickerState>(defaultState);

  const handleClick = useCallback(
    (selectedIndex: number) => {
      setSelectedDays((prev) => {
        const newState = [...prev];
        newState[selectedIndex] = !prev[selectedIndex];
        onChange?.(newState);
        return newState;
      });
    },
    [onChange],
  );

  return (
    <Container>
      {days.map((day, i) => (
        <Day
          day={day}
          handleClick={() => handleClick(i)}
          key={day}
          selected={selectedDays[i]}
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: ${size.s};
`;

const Day: React.FC<{
  day: string;
  handleClick: () => void;
  selected: boolean;
}> = ({ day, handleClick, selected }) => (
  <Circle htmlFor={day} selected={selected} title={day}>
    <InvisibleInput
      aria-checked={selected}
      id={day}
      onChange={handleClick}
      type="checkbox"
    />
    {day.charAt(0)}
  </Circle>
);

const Circle = styled.label<{ selected?: boolean }>`
  all: unset;
  align-items: center;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  font-weight: bold;
  height: 2rem;
  justify-content: center;
  transition: ${transitionDuration.default}ms all ease-in-out;

  :hover {
    background-color: ${gray.light1};
  }

  ${({ selected }) =>
    selected
      ? `
    /* !important allows the selected color to override the :hover color upon clicking */
  background-color: ${gray.dark3} !important;
  color: ${white};
`
      : `
  background-color: ${gray.light2};
    `}
`;

const InvisibleInput = styled.input`
  opacity: 0;
  position: absolute;
  pointer-events: none;
`;
