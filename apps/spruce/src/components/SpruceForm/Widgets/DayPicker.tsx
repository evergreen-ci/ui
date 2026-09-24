import { Description, Label } from "@leafygreen-ui/typography";
import { labelValue } from "@rjsf/utils";
import { DayPicker } from "components/DayPicker";
import ElementWrapper from "../ElementWrapper";
import { SpruceWidgetProps } from "./types";

export const DayPickerWidget: React.FC<SpruceWidgetProps> = ({
  disabled,
  hideLabel,
  id,
  label,
  onChange,
  options,
  readonly,
  value,
}) => {
  const { description, elementWrapperCSS, showLabel } = options;
  const shouldShowLabel = showLabel ?? !hideLabel;
  const widgetLabel = labelValue(label, !shouldShowLabel);

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
