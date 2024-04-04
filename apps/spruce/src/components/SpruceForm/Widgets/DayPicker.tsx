import { Description, Label } from "@leafygreen-ui/typography";
import { DayPicker } from "components/DayPicker";
import ElementWrapper from "../ElementWrapper";
import { SpruceWidgetProps } from "./types";

export const DayPickerWidget: React.FC<
  {
    options: {
      format?: string;
    };
  } & SpruceWidgetProps
> = ({ disabled, id, label, onChange, options, readonly }) => {
  const { description, elementWrapperCSS, showLabel } = options;

  const isDisabled = disabled || readonly;

  return (
    <ElementWrapper css={elementWrapperCSS}>
      {showLabel !== false && (
        <div>
          <Label disabled={isDisabled} htmlFor={id}>
            {label}
          </Label>
        </div>
      )}
      {description && <Description>{description}</Description>}
      <DayPicker onChange={onChange} disabled={isDisabled} />
    </ElementWrapper>
  );
};
