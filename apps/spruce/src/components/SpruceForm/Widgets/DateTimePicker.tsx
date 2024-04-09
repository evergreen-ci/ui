import styled from "@emotion/styled";
import { Description, Label } from "@leafygreen-ui/typography";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import DatePicker from "components/DatePicker";
import AntdTimePicker from "components/TimePicker";
import { size } from "constants/tokens";
import { useUserTimeZone } from "hooks/useUserTimeZone";
import ElementWrapper from "../ElementWrapper";
import { SpruceWidgetProps } from "./types";

export const DateTimePicker: React.FC<
  {
    options: {
      disableBefore?: Date;
      disableAfter?: Date;
    };
  } & SpruceWidgetProps
> = ({ disabled, id, label, onChange, options, readonly, value = "" }) => {
  const {
    description,
    disableAfter,
    disableBefore,
    elementWrapperCSS,
    showLabel,
  } = options;

  const timezone = useUserTimeZone();
  const currentDateTime = utcToZonedTime(new Date(value || null), timezone);
  const isDisabled = disabled || readonly;
  const handleChange = (d: Date) => {
    onChange(zonedTimeToUtc(d, timezone).toString());
  };

  const disabledDate = (current) => {
    const disablePast = disableBefore ? current < disableBefore : false;
    const disableFuture = disableAfter ? current > disableAfter : false;
    return disableFuture || disablePast;
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
          // @ts-expect-error
          getPopupContainer={getPopupContainer}
          data-cy="date-picker"
          onChange={handleChange}
          value={currentDateTime}
          allowClear={false}
          disabled={isDisabled}
          disabledDate={disabledDate}
        />
        <AntdTimePicker
          // @ts-expect-error
          getPopupContainer={getPopupContainer}
          data-cy="time-picker"
          onChange={handleChange}
          value={currentDateTime}
          allowClear={false}
          disabled={isDisabled}
          disabledDate={disabledDate}
        />
      </DateTimeContainer>
    </ElementWrapper>
  );
};

const DateTimeContainer = styled.div`
  > :not(:last-of-type) {
    margin-right: ${size.xs};
  }
`;

export const TimePicker: React.FC<
  {
    options: {
      format?: string;
      useUtc?: boolean;
    };
  } & SpruceWidgetProps
> = ({ disabled, id, label, onChange, options, readonly, value = "" }) => {
  const {
    description,
    elementWrapperCSS,
    format,
    showLabel,
    useUtc = true,
  } = options;
  const timezone = useUserTimeZone();
  const currentDateTime = useUtc
    ? utcToZonedTime(new Date(value || null), timezone)
    : new Date(value || null);
  const isDisabled = disabled || readonly;
  const handleChange = (d: Date) => {
    if (useUtc) {
      onChange(zonedTimeToUtc(d, timezone).toString());
    } else {
      onChange(d.toString());
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
      <AntdTimePicker
        // @ts-expect-error
        getPopupContainer={getPopupContainer}
        data-cy="time-picker"
        format={format}
        onChange={handleChange}
        value={currentDateTime}
        allowClear={false}
        disabled={isDisabled}
      />
    </ElementWrapper>
  );
};

// Fixes bug where DatePicker won't handle onClick events
const getPopupContainer = (triggerNode: HTMLElement) =>
  triggerNode.parentNode.parentNode;
