import { useEffect, useRef } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Banner } from "@leafygreen-ui/banner";
import { Checkbox } from "@leafygreen-ui/checkbox";
import { Copyable } from "@leafygreen-ui/copyable";
import { DatePicker } from "@leafygreen-ui/date-picker";
import { palette } from "@leafygreen-ui/palette";
import { RadioBox, RadioBoxGroup } from "@leafygreen-ui/radio-box-group";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import {
  SegmentedControl,
  SegmentedControlOption,
  SegmentedControlProps,
} from "@leafygreen-ui/segmented-control";
import { Option, Select, Size as SelectSize } from "@leafygreen-ui/select";
import { TextArea } from "@leafygreen-ui/text-area";
import { TextInput, State as TextInputState } from "@leafygreen-ui/text-input";
import { Toggle } from "@leafygreen-ui/toggle";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { Description, Label } from "@leafygreen-ui/typography";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { OneOf } from "@evg-ui/lib/types/utils";
import ElementWrapper from "../ElementWrapper";
import { EnumSpruceWidgetProps, SpruceWidgetProps } from "./types";
import { isNullish, processErrors } from "./utils";

const { yellow } = palette;

export const LeafyGreenTextInput: React.FC<
  { options: { optional?: boolean } } & SpruceWidgetProps
> = ({
  disabled,
  label,
  onChange,
  options,
  placeholder,
  rawErrors,
  readonly,
  schema,
  value,
}) => {
  const {
    ariaLabel,
    ariaLabelledBy,
    "data-cy": dataCy,
    description,
    elementWrapperCSS,
    inputType,
    optional,
    warnings,
  } = options;

  const { errors, hasError } = processErrors(rawErrors);
  const emptyValue = options.emptyValue ?? "";

  const inputProps = {
    ...(!isNullish(schema.maximum) && { max: schema.maximum }),
    ...(!isNullish(schema.minimum) && { min: schema.minimum }),
    errorMessage: hasError ? errors.join(", ") : null,
    state: hasError ? TextInputState.Error : TextInputState.None,
  };
  return (
    <ElementWrapper css={elementWrapperCSS} limitMaxWidth>
      <StyledTextInput
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-cy={dataCy}
        description={description}
        disabled={disabled || readonly}
        label={label}
        onChange={({ target }) =>
          target.value === "" ? onChange(emptyValue) : onChange(target.value)
        }
        optional={optional}
        placeholder={placeholder || undefined}
        type={inputType}
        value={value === null || value === undefined ? "" : `${value}`}
        {...inputProps}
      />
      {!!warnings?.length && (
        <WarningText data-cy="input-warning">{warnings.join(", ")}</WarningText>
      )}
    </ElementWrapper>
  );
};

const StyledTextInput = styled(TextInput)`
  p {
    /* Fixes positioning of "Optional" label */
    margin: 0;
  }
`;

const WarningText = styled.p`
  color: ${yellow.dark2};
  line-height: 1.2;
  margin-top: ${size.xs};
`;

export const LeafyGreenCheckBox: React.FC<SpruceWidgetProps> = ({
  disabled,
  label,
  onChange,
  options,
  readonly,
  value,
}) => {
  const {
    bold,
    customLabel,
    "data-cy": dataCy,
    "data-cy-banner": dataCyBanner,
    description,
    elementWrapperCSS,
    tooltipDescription,
    warnings,
  } = options;
  return (
    <ElementWrapper css={elementWrapperCSS} limitMaxWidth>
      <Checkbox
        bold={bold || false}
        checked={value}
        data-cy={dataCy}
        description={description}
        disabled={disabled || readonly}
        label={
          <>
            {customLabel || label}
            {tooltipDescription && (
              <Tooltip
                justify="middle"
                trigger={
                  <IconContainer>
                    <Icon glyph="InfoWithCircle" size="small" />
                  </IconContainer>
                }
                triggerEvent="hover"
              >
                {tooltipDescription}
              </Tooltip>
            )}
          </>
        }
        onChange={(e) => onChange(e.target.checked)}
      />
      {warnings?.length ? (
        <StyledBanner
          data-cy={dataCyBanner || "warning-banner"}
          variant="warning"
        >
          {warnings.join(", ")}
        </StyledBanner>
      ) : null}
    </ElementWrapper>
  );
};

const IconContainer = styled.span`
  margin-left: ${size.xxs};
  top: 1px;
  vertical-align: text-top;
`;

export const LeafyGreenCopyable: React.FC<SpruceWidgetProps> = ({
  label,
  options,
  value,
}) => {
  const { description } = options;
  return (
    <ElementWrapper limitMaxWidth>
      <Copyable description={description} label={label}>
        {value}
      </Copyable>
    </ElementWrapper>
  );
};

export const LeafyGreenToggle: React.FC<SpruceWidgetProps> = ({
  disabled,
  id,
  label,
  onChange,
  options,
  readonly,
  value,
}) => {
  const {
    customLabel,
    "data-cy": dataCy,
    description,
    descriptionNode,
    elementWrapperCSS,
  } = options;
  return (
    <ElementWrapper css={elementWrapperCSS}>
      <ToggleWrapper>
        <Toggle
          aria-labelledby={`${id}-label`}
          checked={value}
          data-cy={dataCy}
          disabled={disabled || readonly}
          id={id}
          onChange={(checked) => onChange(checked)}
          size="xsmall"
        />
        <Label htmlFor={id} id={`${id}-label`}>
          {customLabel || label}
        </Label>
      </ToggleWrapper>
      {descriptionNode ||
        (description && <Description>{description}</Description>)}
    </ElementWrapper>
  );
};

const ToggleWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: ${size.xs};
`;

export const LeafyGreenSelect: React.FC<
  { options: { allowDeselect?: boolean } } & EnumSpruceWidgetProps
> = ({
  disabled,
  label,
  onChange,
  options,
  placeholder,
  rawErrors,
  readonly,
  value,
}) => {
  const {
    allowDeselect,
    ariaLabelledBy,
    "data-cy": dataCy,
    description,
    elementWrapperCSS,
    enumDisabled,
    enumOptions,
    sizeVariant,
  } = options;
  const { hasError } = processErrors(rawErrors);

  const isDisabled = disabled || readonly;
  const labelProps: OneOf<{ label: string }, { "aria-labelledby": string }> =
    ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : { label };

  return (
    <ElementWrapper css={elementWrapperCSS} limitMaxWidth>
      <Select
        allowDeselect={allowDeselect !== false}
        description={description}
        disabled={isDisabled}
        value={value}
        {...labelProps}
        data-cy={dataCy}
        errorMessage={hasError ? rawErrors?.join(", ") : ""}
        id={dataCy}
        name={dataCy}
        onChange={onChange}
        placeholder={placeholder}
        size={sizeVariant as SelectSize}
        state={hasError && !disabled ? "error" : "none"}
      >
        {enumOptions.map((o) => {
          // LG Select doesn't handle disabled options well. So we need to ensure the selected option is not disabled
          const optionDisabled =
            (value !== o.value && enumDisabled?.includes(o.value)) ?? false;
          return (
            <Option key={o.value} disabled={optionDisabled} value={o.value}>
              {o.label}
            </Option>
          );
        })}
      </Select>
    </ElementWrapper>
  );
};

export const LeafyGreenRadio: React.FC<EnumSpruceWidgetProps> = ({
  disabled,
  id,
  label,
  onChange,
  options,
  value,
}) => {
  const {
    bold,
    "data-cy": dataCy,
    elementWrapperCSS,
    enumDisabled,
    enumOptions,
    inline,
  } = options;
  // RadioGroup components do not accept boolean props for value, so use the indices instead.
  const valueMap = enumOptions.map(({ value: val }) => val);

  return (
    <ElementWrapper css={elementWrapperCSS}>
      {label && (
        <LabelContainer
          css={css`
            ${inline ? "margin-bottom: 0px;" : ""}
          `}
        >
          <Label
            css={css`
              font-weight: ${bold ? "bold" : "normal"};
            `}
            disabled={disabled}
            htmlFor={id}
          >
            {label}
          </Label>
        </LabelContainer>
      )}
      <RadioGroup
        bold={false}
        css={
          inline
            ? css`
                display: flex;
                flex-direction: row;
                gap: ${size.l};
              `
            : ""
        }
        data-cy={dataCy}
        id={id}
        name={label}
        onChange={(e) => onChange(valueMap[Number(e.target.value)])}
        value={valueMap.indexOf(value)}
      >
        {enumOptions.map((o) => {
          const optionDisabled = enumDisabled?.includes(o.value) ?? false;
          const { description } = o.schema ?? {};
          return (
            <Radio
              key={valueMap.indexOf(o.value)}
              data-label={o.label}
              description={description}
              disabled={disabled || optionDisabled}
              value={valueMap.indexOf(o.value)}
            >
              {o.label}
            </Radio>
          );
        })}
      </RadioGroup>
    </ElementWrapper>
  );
};

export const LeafyGreenRadioBox: React.FC<
  {
    options: { description: string | React.JSX.Element };
  } & EnumSpruceWidgetProps
> = ({ disabled, id, label, onChange, options, uiSchema, value }) => {
  const {
    "data-cy": dataCy,
    description,
    elementWrapperCSS,
    enumDisabled,
    enumOptions,
    errors,
    showLabel,
    warnings,
  } = options;

  // Workaround because {ui:widget: hidden} does not play nicely with this widget
  const hide = uiSchema["ui:hide"] ?? false;
  if (hide) {
    return null;
  }

  // RadioBox components do not accept boolean props for value, so use the indices instead.
  const valueMap = enumOptions.map(({ value: val }) => val);

  return (
    <ElementWrapper css={elementWrapperCSS}>
      {showLabel !== false && (
        <LabelContainer>
          <Label disabled={disabled} htmlFor={id}>
            {label}
          </Label>
          {description && <Description>{description}</Description>}
        </LabelContainer>
      )}
      {!!errors && (
        <StyledBanner data-cy="error-banner" variant="danger">
          {errors.join(", ")}
        </StyledBanner>
      )}
      {!!warnings && (
        <StyledBanner data-cy="warning-banner" variant="warning">
          {warnings.join(", ")}
        </StyledBanner>
      )}
      <RadioBoxGroup
        data-cy={dataCy}
        id={id}
        name={label}
        onChange={(e) => onChange(valueMap[Number(e.target.value)])}
        value={valueMap.indexOf(value)}
      >
        {enumOptions.map((o) => {
          const optionDisabled = enumDisabled?.includes(o.value) ?? false;
          return (
            <StyledRadioBox
              key={valueMap.indexOf(o.value)}
              disabled={disabled || optionDisabled}
              value={valueMap.indexOf(o.value)}
            >
              {o.label}
            </StyledRadioBox>
          );
        })}
      </RadioBoxGroup>
    </ElementWrapper>
  );
};

const StyledBanner = styled(Banner)`
  margin-bottom: ${size.s};
`;

const LabelContainer = styled.div`
  margin-bottom: ${size.xs};
`;

const StyledRadioBox = styled(RadioBox)`
  line-height: 1.25;
`;

export const LeafyGreenTextArea: React.FC<SpruceWidgetProps> = ({
  disabled,
  label,
  onChange,
  options,
  placeholder,
  rawErrors,
  readonly,
  value,
}) => {
  const {
    "data-cy": dataCy,
    description,
    elementWrapperCSS,
    emptyValue = "",
    focusOnMount,
    rows,
  } = options;

  const { errors, hasError } = processErrors(rawErrors);
  const el = useRef<HTMLTextAreaElement>();

  useEffect(() => {
    if (focusOnMount) {
      const textarea = el.current;
      if (textarea) {
        textarea.focus();
        textarea.selectionStart = textarea.value.length;
        textarea.selectionEnd = textarea.value.length;
      }
    }
  }, [focusOnMount]);

  return (
    <ElementWrapper css={elementWrapperCSS}>
      <TextArea
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        ref={el}
        data-cy={dataCy}
        description={description}
        disabled={disabled || readonly}
        errorMessage={hasError ? errors.join(", ") : null}
        label={label}
        onChange={({ target }) =>
          target.value === "" ? onChange(emptyValue) : onChange(target.value)
        }
        placeholder={placeholder || undefined}
        rows={rows}
        state={hasError ? "error" : "none"}
        value={value}
      />
    </ElementWrapper>
  );
};

export const LeafyGreenSegmentedControl: React.FC<EnumSpruceWidgetProps> = ({
  disabled,
  label,
  onChange,
  options,
  readonly,
  value,
}) => {
  const {
    "aria-controls": ariaControls,
    "data-cy": dataCy,
    elementWrapperCSS,
    enumDisabled,
    enumOptions,
    sizeVariant,
  } = options;

  const isDisabled = disabled || readonly;

  return (
    <ElementWrapper css={elementWrapperCSS}>
      <StyledSegmentedControl
        aria-controls={ariaControls?.join(" ")}
        data-cy={dataCy}
        label={label}
        onChange={onChange}
        size={sizeVariant as SegmentedControlProps["size"]}
        value={value}
      >
        {enumOptions.map((o) => {
          const optionDisabled = enumDisabled?.includes(o.value) ?? false;
          return (
            <SegmentedControlOption
              key={o.value}
              disabled={isDisabled || optionDisabled}
              value={o.value}
            >
              {o.label}
            </SegmentedControlOption>
          );
        })}
      </StyledSegmentedControl>
    </ElementWrapper>
  );
};

const StyledSegmentedControl = styled(SegmentedControl)`
  box-sizing: border-box;
  margin-bottom: ${size.s};
`;

export const LeafyGreenDatePicker: React.FC<
  {
    options: {
      disableBefore?: Date;
      disableAfter?: Date;
    };
  } & SpruceWidgetProps
> = ({ disabled, label, onChange, options, readonly, value = "" }) => {
  const {
    "data-cy": dataCy = "date-picker",
    description,
    disableAfter,
    disableBefore,
    elementWrapperCSS,
  } = options;

  const isDisabled = disabled || readonly;

  return (
    <ElementWrapper css={elementWrapperCSS} limitMaxWidth>
      <DatePicker
        data-cy={dataCy}
        description={description}
        disabled={isDisabled}
        label={label}
        max={disableAfter}
        min={disableBefore}
        onDateChange={(v) => onChange(v?.toUTCString())}
        value={new Date(value)}
      />
    </ElementWrapper>
  );
};
