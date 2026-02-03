import styled from "@emotion/styled";
import { DatePicker } from "@leafygreen-ui/date-picker";
import {
  setToUTCMidnight,
  DateType,
  isInvalidDateObject,
} from "@leafygreen-ui/date-utils";
import { Description, Label } from "@leafygreen-ui/typography";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { size } from "@evg-ui/lib/constants";
import LGTimePicker from "components/TimePicker";
import { useUserTimeZone } from "hooks/useUserTimeZone";
import ElementWrapper from "../ElementWrapper";
import { SpruceWidgetProps } from "./types";

enum Caller {
  Date,
  Time,
}

export const DateTimePicker: React.FC<
  {
    options: {
      disableBefore?: Date;
      disableAfter?: Date;
    };
  } & SpruceWidgetProps
> = ({ disabled, id, label, onChange, options, readonly, value = "" }) => {
  const isDisabled = disabled || readonly;
  const {
    description,
    disableAfter,
    disableBefore,
    elementWrapperCSS,
    showLabel,
  } = options;

  const timezone = useUserTimeZone();

  const currentDateTime = timezone
    ? toZonedTime(new Date(value || null), timezone)
    : new Date(value || null);

  const handleChange = (caller: Caller) => (newDate?: DateType) => {
    if (!newDate) return;
    if (isInvalidDateObject(newDate)) return;

    // LG DatePicker overwrites the time, so preserve it as such
    if (caller === Caller.Date) {
      const hours = currentDateTime.getUTCHours();
      const minutes = currentDateTime.getUTCMinutes();
      newDate.setUTCHours(hours);
      newDate.setUTCMinutes(minutes);
    }

    if (timezone) {
      onChange(fromZonedTime(newDate, timezone).toString());
    } else {
      onChange(newDate.toString());
    }
  };

  return (
    <ElementWrapper css={elementWrapperCSS}>
      {showLabel !== false && (
        <Label disabled={isDisabled} htmlFor={id}>
          {label}
        </Label>
      )}
      {description && <Description>{description}</Description>}
      <DateTimeContainer>
        <DatePicker
          aria-label="date-picker"
          data-cy="date-picker"
          disabled={isDisabled}
          max={disableAfter ? setToUTCMidnight(disableAfter) : undefined}
          min={disableBefore ? setToUTCMidnight(disableBefore) : undefined}
          onDateChange={handleChange(Caller.Date)}
          value={currentDateTime}
        />
        {/* TODO: Replace with official component following completion of LG-3931.
         * Additionally, uninstall @leafygreen-ui/form-field. */}
        <LGTimePicker
          data-cy="time-picker"
          disabled={isDisabled}
          onDateChange={handleChange(Caller.Time)}
          value={currentDateTime}
        />
      </DateTimeContainer>
    </ElementWrapper>
  );
};

const DateTimeContainer = styled.div`
  display: flex;
  align-items: center;
  > :not(:last-of-type) {
    margin-right: ${size.xs};
  }
`;

export const TimePicker: React.FC<SpruceWidgetProps> = ({
  disabled,
  label,
  onChange,
  options,
  readonly,
  value,
}) => {
  const { description, elementWrapperCSS } = options;
  const isDisabled = disabled || readonly;
  const currentDateTime = new Date(value || null);

  const handleChange = (d?: DateType) => {
    if (d) {
      onChange(d.toString());
    }
  };

  return (
    <ElementWrapper css={elementWrapperCSS}>
      {description && <Description>{description}</Description>}
      {/* TODO: Replace with official component following completion of LG-3931.
       * Additionally, uninstall @leafygreen-ui/form-field. */}
      <LGTimePicker
        data-cy="time-picker"
        disabled={isDisabled}
        label={label}
        onDateChange={handleChange}
        value={currentDateTime}
      />
    </ElementWrapper>
  );
};
