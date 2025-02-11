import { forwardRef } from "react";
import { PickerTimeProps } from "antd/es/date-picker/generatePicker";
import DatePicker from "components/DatePicker";

export type TimePickerProps = Omit<PickerTimeProps<Date>, "picker">;

const TimePicker = forwardRef<any, TimePickerProps>((props, ref) => (
  <DatePicker {...props} ref={ref} mode={undefined} picker="time" />
));

TimePicker.displayName = "TimePicker";

export default TimePicker;
