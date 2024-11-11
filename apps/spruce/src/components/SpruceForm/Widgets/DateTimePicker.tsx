import styled from "@emotion/styled";
import { Description, Label } from "@leafygreen-ui/typography";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { size } from "@evg-ui/lib/constants/tokens";
import DatePicker from "components/DatePicker";
import AntdTimePicker from "components/TimePicker";
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
  const currentDateTime = timezone
    ? toZonedTime(new Date(value || null), timezone)
    : new Date(value || null);
  const isDisabled = disabled || readonly;
  const handleChange = (d: Date | null) => {
    if (!d) return;

    if (timezone) {
      onChange(fromZonedTime(d, timezone).toString());
    } else {
      onChange(d.toString());
    }
  };

  const disabledDate = (current: Date) => {
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
          allowClear={false}
          data-cy="date-picker"
          disabled={isDisabled}
          disabledDate={disabledDate}
          // @ts-expect-error
          getPopupContainer={getPopupContainer}
          onChange={handleChange}
          value={currentDateTime}
        />
        <AntdTimePicker
          allowClear={false}
          data-cy="time-picker"
          disabled={isDisabled}
          disabledDate={disabledDate}
          // @ts-expect-error
          getPopupContainer={getPopupContainer}
          onChange={handleChange}
          value={currentDateTime}
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
    };
  } & SpruceWidgetProps
> = ({ disabled, id, label, onChange, options, readonly, value = "" }) => {
  const { description, elementWrapperCSS, format, showLabel } = options;
  const currentDateTime = new Date(value || null);
  const isDisabled = disabled || readonly;
  const handleChange = (d: Date | null) => {
    if (d) {
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
        allowClear={false}
        data-cy="time-picker"
        disabled={isDisabled}
        format={format}
        // @ts-expect-error
        getPopupContainer={getPopupContainer}
        id={id}
        inputReadOnly
        needConfirm
        onChange={handleChange}
        showNow={false}
        // Disable typing into timepicker due to Antd bug:
        // https://github.com/ant-design/ant-design/issues/45564
        value={currentDateTime}
      />
    </ElementWrapper>
  );
};

// Fixes bug where DatePicker won't handle onClick events
const getPopupContainer = (triggerNode: HTMLElement) =>
  triggerNode?.parentNode?.parentNode;
