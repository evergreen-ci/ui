import { useState } from "react";
import styled from "@emotion/styled";
import { Select, Option } from "@leafygreen-ui/select";
import { Label } from "@leafygreen-ui/typography";
import { size, zIndex } from "@evg-ui/lib/constants/tokens";
import TextInput from "components/TextInputWithValidation";

type option = {
  value: string;
  displayName: string;
  placeHolderText: string;
};

interface TupleSelectProps {
  options: option[];
  onSubmit?: ({ category, value }: { category: string; value: string }) => void;
  validator?: (value: string) => boolean;
  validatorErrorMessage?: string;
  label?: React.ReactNode;
}
const TupleSelect: React.FC<TupleSelectProps> = ({
  label,
  onSubmit = () => {},
  options,
  validator = () => true,
  validatorErrorMessage = "Invalid Input",
}) => {
  const [selected, setSelected] = useState(options[0].value);

  const handleOnSubmit = (input: string) => {
    onSubmit({ category: selected, value: input });
  };

  const selectedOption =
    options.find((o) => o.value === selected) ?? options[0];

  return (
    <Container>
      <Label htmlFor="filter-input">
        <LabelContainer>{label}</LabelContainer>
      </Label>
      <InputGroup>
        <GroupedSelect
          allowDeselect={false}
          aria-labelledby="Tuple Select"
          data-cy="tuple-select-dropdown"
          dropdownWidthBasis="option"
          onChange={(v) => setSelected(v)}
          popoverZIndex={zIndex.popover}
          value={selected}
        >
          {options.map((o) => (
            <Option
              key={o.value}
              data-cy={`tuple-select-option-${o.value}`}
              value={o.value}
            >
              {o.displayName}
            </Option>
          ))}
        </GroupedSelect>
        <GroupedTextInput
          aria-label={selectedOption.displayName}
          aria-labelledby={selectedOption.displayName}
          clearOnSubmit
          data-cy="tuple-select-input"
          id="filter-input"
          onSubmit={handleOnSubmit}
          placeholder={selectedOption.placeHolderText}
          // Chrome will overlay a clear "x" button on the input if type is not set to 'search'
          type="text"
          validator={validator}
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
  div > div {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
`;

export default TupleSelect;
