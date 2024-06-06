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
} from "./LeafyGreenWidgets";
import { MultiSelect } from "./MultiSelect";

const widgets = {
  DateWidget: LeafyGreenDatePicker,
  DateTimeWidget: DateTimePicker,
  DayPickerWidget,
  TimeWidget: TimePicker,
  TextWidget: LeafyGreenTextInput,
  TextareaWidget: LeafyGreenTextArea,
  CheckboxWidget: LeafyGreenCheckBox,
  SegmentedControlWidget: LeafyGreenSegmentedControl,
  SelectWidget: LeafyGreenSelect,
  RadioWidget: LeafyGreenRadio,
  RadioBoxWidget: LeafyGreenRadioBox,
  MultiSelectWidget: MultiSelect,
};

export default widgets;
