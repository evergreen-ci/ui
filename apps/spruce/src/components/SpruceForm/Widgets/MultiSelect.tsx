import { labelValue } from "@rjsf/utils";
import { ALL_VALUE, TreeSelect } from "@evg-ui/lib/components/TreeSelect";
import Dropdown from "components/Dropdown";
import ElementWrapper from "../ElementWrapper";
import styles from "./MultiSelect.module.css";
import { EnumSpruceWidgetProps } from "./types";

export const MultiSelect: React.FC<EnumSpruceWidgetProps> = ({
  disabled,
  hideLabel,
  label,
  onChange,
  options,
  rawErrors,
  value,
}) => {
  const {
    "data-testid": dataTestId,
    elementWrapperCSS,
    enumOptions = [],
  } = options;
  const widgetLabel = labelValue(label, hideLabel);

  const dropdownOptions = [
    {
      title: "All",
      key: ALL_VALUE,
      value: ALL_VALUE,
    },
    ...enumOptions.map((o) => ({
      title: o.label,
      key: o.value,
      value: o.value,
    })),
  ];

  const handleChange = (selected: string[]) => {
    // Filter out the "all" value since it isn't a valid enum.
    onChange(selected.filter((s) => s !== ALL_VALUE));
  };

  const includeAll = value.length === enumOptions.length;
  const selectedOptions = [...value, ...(includeAll ? [ALL_VALUE] : [])];

  return (
    <ElementWrapper css={elementWrapperCSS} limitMaxWidth>
      <div className={styles.container}>
        {widgetLabel && (
          <label htmlFor={`${label}-multiselect`}>{widgetLabel}</label>
        )}
        <Dropdown
          buttonText={`${widgetLabel ? `${widgetLabel}: ` : ""}${
            value.length ? value.join(", ") : "No options selected."
          }`}
          data-testid={dataTestId}
          disabled={disabled}
          id={`${label}-multiselect`}
        >
          <TreeSelect
            onChange={handleChange}
            state={selectedOptions}
            tData={dropdownOptions}
          />
        </Dropdown>
        {(rawErrors?.length ?? 0) > 0 && (
          <span className="error">{rawErrors?.join(", ")}</span>
        )}
      </div>
    </ElementWrapper>
  );
};

export default MultiSelect;
