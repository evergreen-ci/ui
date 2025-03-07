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
  LeafyGreenSegmentedControl,
  LeafyGreenToggle,
} from "./LeafyGreenWidgets";
import { MultiSelect } from "./MultiSelect";

const widgets = {
  CheckboxWidget: LeafyGreenCheckBox,
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
