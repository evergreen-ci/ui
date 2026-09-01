import { useEffect, useRef } from "react";
import { Banner } from "@leafygreen-ui/banner";
import { Checkbox } from "@leafygreen-ui/checkbox";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { Copyable } from "@leafygreen-ui/copyable";
import { DatePicker } from "@leafygreen-ui/date-picker";
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
import { OneOf } from "@evg-ui/lib/types/utils";
import { cx } from "@evg-ui/lib/utils/css";
import ElementWrapper from "../ElementWrapper";
import styles from "./LeafyGreenWidgets.module.css";
import { EnumSpruceWidgetProps, SpruceWidgetProps } from "./types";
import { isNullish, processErrors } from "./utils";

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
    "data-testid": dataTestId,
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
      <TextInput
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        autoComplete="off"
        className={styles.textInput}
        data-testid={dataTestId}
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
        <p className={styles.warningText} data-testid="input-warning">
          {warnings.join(", ")}
        </p>
      )}
    </ElementWrapper>
  );
};

export const LeafyGreenCheckBox: React.FC<SpruceWidgetProps> = ({
  disabled,
  label,
  onChange,
  options,
  rawErrors,
  readonly,
  value,
}) => {
  const {
    bold,
    customLabel,
    "data-testid": dataTestId,
    "data-testid-banner": dataTestIdBanner,
    description,
    elementWrapperCSS,
    tooltipDescription,
    warnings,
  } = options;
  const { errors, hasError } = processErrors(rawErrors);
  return (
    <ElementWrapper css={elementWrapperCSS} limitMaxWidth>
      <Checkbox
        bold={bold || false}
        checked={value}
        data-testid={dataTestId}
        description={description}
        disabled={disabled || readonly}
        label={
          <>
            {customLabel || label}
            {tooltipDescription && (
              <Tooltip
                justify="middle"
                trigger={
                  <span className={styles.iconContainer}>
                    <Icon glyph="InfoWithCircle" size="small" />
                  </span>
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
      {hasError ? (
        <StyledBanner data-testid="error-banner" variant="danger">
          {errors.join(", ")}
        </StyledBanner>
      ) : null}
      {warnings?.length ? (
        <Banner
          className={styles.banner}
          data-testid={dataTestIdBanner || "warning-banner"}
          variant="warning"
        >
          {warnings.join(", ")}
        </Banner>
      ) : null}
    </ElementWrapper>
  );
};

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
    "data-testid": dataTestId,
    description,
    descriptionNode,
    elementWrapperCSS,
  } = options;
  return (
    <ElementWrapper css={elementWrapperCSS}>
      <div className={styles.toggleWrapper}>
        <Toggle
          aria-labelledby={`${id}-label`}
          checked={value}
          data-testid={dataTestId}
          disabled={disabled || readonly}
          id={id}
          onChange={(checked) => onChange(checked)}
          size="xsmall"
        />
        <Label htmlFor={id} id={`${id}-label`}>
          {customLabel || label}
        </Label>
      </div>
      {descriptionNode ||
        (description && (
          <Description className={styles.toggleDescription}>
            {description}
          </Description>
        ))}
    </ElementWrapper>
  );
};

export const LeafyGreenSelect: React.FC<
  {
    options: {
      allowDeselect?: boolean;
      optionsLabelMap?: Record<string, React.ReactNode>;
    };
  } & EnumSpruceWidgetProps
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
    "data-testid": dataTestId,
    description,
    elementWrapperCSS,
    enumDisabled,
    enumOptions,
    optionsLabelMap,
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
        data-testid={dataTestId}
        errorMessage={hasError ? rawErrors?.join(", ") : ""}
        id={dataTestId}
        name={dataTestId}
        onChange={(v: string) => onChange(v)}
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
              {optionsLabelMap ? optionsLabelMap[o.value] : o.label}
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
    "data-testid": dataTestId,
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
        <div
          className={cx(
            styles.labelContainer,
            inline && styles.inlineLabelContainer,
          )}
        >
          <Label
            disabled={disabled}
            htmlFor={id}
            style={{ fontWeight: bold ? "bold" : "normal" }}
          >
            {label}
          </Label>
        </div>
      )}
      <RadioGroup
        bold={false}
        className={inline ? styles.radioGroupInline : undefined}
        data-testid={dataTestId}
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
    "data-testid": dataTestId,
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
        <div className={styles.labelContainer}>
          <Label disabled={disabled} htmlFor={id}>
            {label}
          </Label>
          {description && <Description>{description}</Description>}
        </div>
      )}
      {!!errors && (
        <Banner
          className={styles.banner}
          data-testid="error-banner"
          variant="danger"
        >
          {errors.join(", ")}
        </Banner>
      )}
      {!!warnings && (
        <Banner
          className={styles.banner}
          data-testid="warning-banner"
          variant="warning"
        >
          {warnings.join(", ")}
        </Banner>
      )}
      <RadioBoxGroup
        className={styles.radioBoxGroup}
        data-testid={dataTestId}
        id={id}
        name={label}
        onChange={(e) => onChange(valueMap[Number(e.target.value)])}
        value={valueMap.indexOf(value)}
      >
        {enumOptions.map((o) => {
          const optionDisabled = enumDisabled?.includes(o.value) ?? false;
          return (
            <RadioBox
              key={valueMap.indexOf(o.value)}
              className={styles.radioBox}
              disabled={disabled || optionDisabled}
              value={valueMap.indexOf(o.value)}
            >
              {o.label}
            </RadioBox>
          );
        })}
      </RadioBoxGroup>
    </ElementWrapper>
  );
};

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
    "data-testid": dataTestId,
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
        data-testid={dataTestId}
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
    "data-testid": dataTestId,
    elementWrapperCSS,
    enumDisabled,
    enumOptions,
    sizeVariant,
  } = options;

  const isDisabled = disabled || readonly;

  return (
    <ElementWrapper css={elementWrapperCSS}>
      <SegmentedControl
        aria-controls={ariaControls?.join(" ")}
        className={styles.segmentedControl}
        data-testid={dataTestId}
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
      </SegmentedControl>
    </ElementWrapper>
  );
};

export const LeafyGreenDatePicker: React.FC<
  {
    options: {
      disableBefore?: Date;
      disableAfter?: Date;
    };
  } & SpruceWidgetProps
> = ({ disabled, label, onChange, options, readonly, value = "" }) => {
  const {
    "data-testid": dataTestId = "date-picker",
    description,
    disableAfter,
    disableBefore,
    elementWrapperCSS,
  } = options;

  const isDisabled = disabled || readonly;

  return (
    <ElementWrapper css={elementWrapperCSS} limitMaxWidth>
      <DatePicker
        data-testid={dataTestId}
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

export const LeafyGreenCombobox: React.FC<EnumSpruceWidgetProps> = ({
  disabled,
  label,
  onChange,
  options,
  readonly,
  value,
}) => {
  const {
    "data-testid": dataTestId = "combobox",
    description,
    elementWrapperCSS,
    enumOptions = [],
  } = options;

  const isDisabled = disabled || readonly;

  return (
    <ElementWrapper css={elementWrapperCSS} limitMaxWidth>
      <Combobox
        clearable={false}
        data-testid={dataTestId}
        description={description}
        disabled={isDisabled}
        label={label}
        // @ts-expect-error: onChange types are not compatible.
        onChange={(v: string) => onChange(v)}
        value={value}
      >
        {enumOptions.map((o) => (
          <ComboboxOption key={o.value} displayName={o.label} value={o.value} />
        ))}
      </Combobox>
    </ElementWrapper>
  );
};
