import { DateTimePicker } from "./DateTimePicker";
import { DayPickerWidget } from "./DayPicker";
import {
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
  DateTimeWidget: DateTimePicker,
  DayPickerWidget,
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
