import { ChipInput } from "./ChipInput";
import { DateTimePicker, TimePicker } from "./DateTimePicker";
import { DayPickerWidget } from "./DayPicker";
import {
  LeafyGreenDatePicker,
  LeafyGreenTextInput,
  LeafyGreenTextArea,
  LeafyGreenSelect,
  LeafyGreenRadio,
  LeafyGreenRadioBox,
  LeafyGreenCheckBox,
  LeafyGreenCopyable,
  LeafyGreenSegmentedControl,
  LeafyGreenToggle,
  LeafyGreenCombobox,
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
