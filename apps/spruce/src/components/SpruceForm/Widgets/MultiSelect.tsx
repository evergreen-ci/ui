import styled from "@emotion/styled";
import { TreeSelect, ALL_VALUE } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import Dropdown from "components/Dropdown";
import ElementWrapper from "../ElementWrapper";
import { EnumSpruceWidgetProps } from "./types";

export const MultiSelect: React.FC<EnumSpruceWidgetProps> = ({
  disabled,
  label,
  onChange,
  options,
  rawErrors,
  value,
}) => {
  const { "data-cy": dataCy, elementWrapperCSS, enumOptions = [] } = options;

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
      <Container>
        <label htmlFor={`${label}-multiselect`}>{label}</label>
        <Dropdown
          buttonText={`${label}: ${
            value.length ? value.join(", ") : "No options selected."
          }`}
          data-cy={dataCy}
          disabled={disabled}
          id={`${label}-multiselect`}
        >
          <TreeSelect
            onChange={handleChange}
            state={selectedOptions}
            tData={dropdownOptions}
          />
        </Dropdown>
        {rawErrors?.length > 0 && (
          <span className="error">{rawErrors?.join(", ")}</span>
        )}
      </Container>
    </ElementWrapper>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};
`;

export default MultiSelect;
