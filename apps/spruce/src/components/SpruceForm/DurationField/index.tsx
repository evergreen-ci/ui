import { useState } from "react";
import styled from "@emotion/styled";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { State, TextInput } from "@leafygreen-ui/text-input";
import { Description, Label } from "@leafygreen-ui/typography";
import { Field } from "@rjsf/core";
import { size } from "@evg-ui/lib/constants/tokens";
import ElementWrapper from "../ElementWrapper";
import {
  DEFAULT_ADMIN_DURATION,
  DISABLED_ADMIN_DURATION,
  DurationMode,
  getDurationMode,
  humanizeAdminDuration,
  validateCustomDuration,
} from "./utils";

type DurationFieldOptions = {
  allowDisabled?: boolean;
  "data-cy"?: string;
  defaultDuration?: string;
  defaultLabel?: string;
  disabledDescription?: string;
};

const DEFAULT_CUSTOM_DURATION = "1h";

export const DurationField: Field = ({
  disabled,
  formData = DEFAULT_ADMIN_DURATION,
  id,
  onChange,
  readonly,
  schema,
  uiSchema,
}) => {
  const {
    allowDisabled = false,
    "data-cy": dataCy = "duration-field",
    defaultDuration = DEFAULT_CUSTOM_DURATION,
    defaultLabel = defaultDuration,
    disabledDescription = "This setting is disabled and its associated work will be skipped.",
  } = (uiSchema?.["ui:options"] ?? {}) as DurationFieldOptions;
  const initialMode = getDurationMode(formData);
  const initialCustomDuration =
    initialMode === "custom" || (initialMode === "disabled" && !allowDisabled)
      ? formData
      : defaultDuration;
  const mode: DurationMode =
    initialMode === "disabled" && !allowDisabled ? "custom" : initialMode;
  const [customDuration, setCustomDuration] = useState(initialCustomDuration);

  const isDisabled = disabled || readonly;
  const customDurationValue = mode === "custom" ? formData : customDuration;
  const customDurationIsValid = validateCustomDuration(customDurationValue);
  const interpretation = customDurationIsValid
    ? humanizeAdminDuration(customDurationValue)
    : null;

  const handleModeChange = (nextMode: DurationMode) => {
    if (mode === "custom" && validateCustomDuration(formData)) {
      setCustomDuration(formData);
    }
    switch (nextMode) {
      case "default":
        onChange(DEFAULT_ADMIN_DURATION);
        break;
      case "disabled":
        onChange(DISABLED_ADMIN_DURATION);
        break;
      case "custom": {
        const nextDuration = validateCustomDuration(customDuration)
          ? customDuration
          : defaultDuration;
        onChange(nextDuration);
        break;
      }
      default:
        break;
    }
  };

  return (
    <ElementWrapper>
      <Label disabled={isDisabled} htmlFor={`${id}-mode`}>
        {schema.title}
      </Label>
      <ModeGroup
        data-cy={`${dataCy}-mode`}
        id={`${id}-mode`}
        name={schema.title}
        onChange={({ target }) =>
          handleModeChange(target.value as DurationMode)
        }
        value={mode}
      >
        <Radio
          description={`Use the configured default of ${defaultLabel}.`}
          disabled={isDisabled}
          value="default"
        >
          Use default
        </Radio>
        <Radio
          description="Set a compact duration such as 30s, 5m, 2h, 5d, 1w, or 2h30m."
          disabled={isDisabled}
          value="custom"
        >
          Custom
        </Radio>
        {allowDisabled && (
          <Radio
            description={disabledDescription}
            disabled={isDisabled}
            value="disabled"
          >
            Disabled
          </Radio>
        )}
      </ModeGroup>
      {mode === "custom" && (
        <CustomDurationContainer>
          <TextInput
            autoComplete="off"
            data-cy={`${dataCy}-input`}
            description="Units: ns, us, µs, ms, s, m, h, d, and w. Compound values are supported."
            disabled={isDisabled}
            errorMessage={
              customDurationIsValid
                ? undefined
                : "Enter a positive compact duration, such as 2h30m."
            }
            label="Custom duration"
            onChange={({ target }) => {
              setCustomDuration(target.value);
              onChange(target.value);
            }}
            placeholder={defaultDuration}
            state={customDurationIsValid ? State.None : State.Error}
            value={customDurationValue}
          />
          {interpretation && (
            <Interpretation data-cy={`${dataCy}-interpretation`}>
              Interpreted as {interpretation}.
            </Interpretation>
          )}
        </CustomDurationContainer>
      )}
      {mode === "default" && (
        <ModeExplanation>
          The server will use its default of {defaultLabel}.
        </ModeExplanation>
      )}
    </ElementWrapper>
  );
};

const ModeGroup = styled(RadioGroup)`
  margin-top: ${size.xs};
`;

const CustomDurationContainer = styled.div`
  margin-top: ${size.s};
  max-width: 400px;
`;

const Interpretation = styled(Description)`
  margin-top: ${size.xs};
`;

const ModeExplanation = styled(Description)`
  margin-top: ${size.xs};
`;
