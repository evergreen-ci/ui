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
  DateWidget: LeafyGreenDatePicker,
  DateTimeWidget: DateTimePicker,
  DayPickerWidget,
  MultiSelectWidget: MultiSelect,
  RadioWidget: LeafyGreenRadio,
  RadioBoxWidget: LeafyGreenRadioBox,
  SegmentedControlWidget: LeafyGreenSegmentedControl,
  SelectWidget: LeafyGreenSelect,
  TimeWidget: TimePicker,
  TextWidget: LeafyGreenTextInput,
  TextareaWidget: LeafyGreenTextArea,
  ToggleWidget: LeafyGreenToggle,
};

export default widgets;
