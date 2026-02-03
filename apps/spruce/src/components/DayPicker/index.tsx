import { useCallback, useState } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { transitionDuration } from "@leafygreen-ui/tokens";
import { size } from "@evg-ui/lib/constants";
import { days } from "constants/time";

const { gray, white } = palette;

const emptyState = new Array(days.length).fill(false);

type DayPickerState = Array<boolean>;

/**
 * Allows selecting days of the week
 * @param props - React props
 * @param props.defaultState - optionally specifies the initial selected days
 * @param props.onChange - optionally calls a side effect function with the new selection state when a change is made
 * @param props.disabled - optionally disable interacting with the entire component
 * @returns DayPicker - DayPicker component
 */
export const DayPicker: React.FC<{
  defaultState?: DayPickerState;
  disabled?: boolean;
  onChange?: (value: DayPickerState) => void;
}> = ({ defaultState = emptyState, disabled = false, onChange }) => {
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
    <Container data-cy="daypicker">
      {days.map((day, i) => (
        <Day
          key={day}
          day={day}
          disabled={disabled}
          handleClick={() => handleClick(i)}
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
  disabled: boolean;
  handleClick: () => void;
  selected: boolean;
}> = ({ day, disabled, handleClick, selected }) => (
  <Circle htmlFor={day} selected={selected} title={day}>
    <InvisibleInput
      aria-checked={selected}
      disabled={disabled}
      id={day}
      onChange={handleClick}
      type="checkbox"
    />
    {day.charAt(0)}
  </Circle>
);

const Circle = styled.label<{ selected: boolean }>`
  all: unset;
  align-items: center;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  display: flex;
  font-weight: bold;
  height: 2rem;
  justify-content: center;
  transition: ${transitionDuration.default}ms all ease-in-out;

  :has(:enabled) {
    cursor: pointer;

    ${({ selected }) =>
      selected
        ? `
/* !important allows the selected color to override the :hover color upon clicking */
background-color: ${gray.dark3} !important;
color: ${white};
`
        : `background-color: ${gray.light2};`}

    :hover {
      background-color: ${gray.light1};
    }
  }

  :has(:disabled) {
    ${({ selected }) => selected && `background-color: ${gray.light2}`};

    color: ${gray.light1};
    cursor: not-allowed;
  }
`;

const InvisibleInput = styled.input`
  opacity: 0;
  position: absolute;
  pointer-events: none;
`;
