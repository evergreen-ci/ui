import { useState } from "react";
import styled from "@emotion/styled";
import { Select, Option } from "@leafygreen-ui/select";
import { Label } from "@leafygreen-ui/typography";
import { size, zIndex } from "@evg-ui/lib/constants/tokens";
import TextInput from "components/TextInputWithValidation";

type option = {
  value: string;
  displayName: string;
  placeholderText?: string;
  validator?: (value: string) => boolean;
};

interface TupleSelectProps {
  ariaLabel: string;
  "data-cy": string;
  id: string;
  label: React.ReactNode;
  options: option[];
  placeholder?: string;
  onSubmit?: ({ category, value }: { category: string; value: string }) => void;
  validator?: (value: string) => boolean;
  validatorErrorMessage?: string;
}

const TupleSelect: React.FC<TupleSelectProps> = ({
  ariaLabel,
  "data-cy": dataCy,
  id,
  label,
  onSubmit = () => {},
  options,
  placeholder,
  validator,
  validatorErrorMessage = "Invalid input",
}) => {
  const [selected, setSelected] = useState(options[0].value);

  const handleOnSubmit = (input: string) => {
    onSubmit({ category: selected, value: input });
  };

  const selectedOption =
    options.find((o) => o.value === selected) ?? options[0];

  return (
    <Container>
      <Label htmlFor={id}>
        <LabelContainer>{label}</LabelContainer>
      </Label>
      <InputGroup>
        <GroupedSelect
          allowDeselect={false}
          aria-labelledby={`${ariaLabel} Select`}
          data-cy={`${dataCy}-select`}
          dropdownWidthBasis="option"
          onChange={(v) => setSelected(v)}
          popoverZIndex={zIndex.popover}
          value={selected}
        >
          {options.map((o) => (
            <Option key={o.value} value={o.value}>
              {o.displayName}
            </Option>
          ))}
        </GroupedSelect>
        <GroupedTextInput
          aria-label={`${ariaLabel} Input`}
          aria-labelledby={`${ariaLabel} Input`}
          clearOnSubmit
          data-cy={`${dataCy}-input`}
          id={id}
          onSubmit={handleOnSubmit}
          placeholder={placeholder || selectedOption.placeholderText}
          // Chrome will overlay a clear "x" button on the input if type is not set to 'search'
          type="text"
          validator={validator || selectedOption.validator}
          validatorErrorMessage={validatorErrorMessage}
        />
      </InputGroup>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-top: ${size.xxs};
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const GroupedSelect = styled(Select)`
  /* overwrite lg borders https://jira.mongodb.org/browse/PD-1995 */
  button {
    margin-top: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 0;
    width: max-content;
  }
`;

const GroupedTextInput = styled(TextInput)`
  /* overwrite lg borders https://jira.mongodb.org/browse/PD-1995 */
  > div > div {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
`;

export default TupleSelect;
