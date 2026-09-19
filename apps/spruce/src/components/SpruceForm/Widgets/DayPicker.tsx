import { Description, Label } from "@leafygreen-ui/typography";
import { DayPicker } from "components/DayPicker";
import ElementWrapper from "../ElementWrapper";
import { SpruceWidgetProps } from "./types";
import { getWidgetLabel } from "./utils";

export const DayPickerWidget: React.FC<SpruceWidgetProps> = ({
  disabled,
  hideLabel,
  id,
  label,
  onChange,
  options,
  readonly,
  schema,
  uiSchema,
  value,
}) => {
  const { description, elementWrapperCSS, showLabel } = options;
  const shouldShowLabel = showLabel ?? !hideLabel;
  const widgetLabel = getWidgetLabel(label, schema, uiSchema);

  const isDisabled = disabled || readonly;

  return (
    <ElementWrapper css={elementWrapperCSS}>
      {shouldShowLabel && (
        <div>
          <Label disabled={isDisabled} htmlFor={id}>
            {widgetLabel}
          </Label>
        </div>
      )}
      {description && <Description>{description}</Description>}
      <DayPicker
        defaultState={value}
        disabled={isDisabled}
        onChange={onChange}
      />
    </ElementWrapper>
  );
};
