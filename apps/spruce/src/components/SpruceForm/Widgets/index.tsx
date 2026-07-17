import { ChipInput } from "./ChipInput";
import { DateTimePicker, TimePicker } from "./DateTimePicker";
import { DayPickerWidget } from "./DayPicker";
import {
  LeafyGreenCheckBox,
  LeafyGreenCombobox,
  LeafyGreenCopyable,
  LeafyGreenDatePicker,
  LeafyGreenRadio,
  LeafyGreenRadioBox,
  LeafyGreenSegmentedControl,
  LeafyGreenSelect,
  LeafyGreenTextArea,
  LeafyGreenTextInput,
  LeafyGreenToggle,
} from "./LeafyGreenWidgets";
import { MultiSelect } from "./MultiSelect";

const widgets = {
  CheckboxWidget: LeafyGreenCheckBox,
  ChipInputWidget: ChipInput,
  ComboboxWidget: LeafyGreenCombobox,
  CopyableWidget: LeafyGreenCopyable,
  DateTimeWidget: DateTimePicker,
  DateWidget: LeafyGreenDatePicker,
  DayPickerWidget,
  MultiSelectWidget: MultiSelect,
  RadioBoxWidget: LeafyGreenRadioBox,
  RadioWidget: LeafyGreenRadio,
  SegmentedControlWidget: LeafyGreenSegmentedControl,
  SelectWidget: LeafyGreenSelect,
  TextareaWidget: LeafyGreenTextArea,
  TextWidget: LeafyGreenTextInput,
  TimeWidget: TimePicker,
  ToggleWidget: LeafyGreenToggle,
};

export default widgets;
