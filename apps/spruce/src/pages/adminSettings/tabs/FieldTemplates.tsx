import { useState } from "react";
import styled from "@emotion/styled";
import TextInput from "@leafygreen-ui/text-input";
import { ArrayFieldTemplateProps } from "@rjsf/core";
import { size } from "@evg-ui/lib/constants/tokens";
import { PlusButton, Variant } from "components/Buttons";
import { FilterChipType } from "../../../components/FilterChips/FilterChip";
import FilterChips from "../../../components/FilterChips/index";

export const ArrayFieldTemplate: React.FC<
  Pick<ArrayFieldTemplateProps, "items">
> = ({ items }) => {
  const [chips, setChips] = useState<FilterChipType[]>(
    items.map((item) => ({
      key: item.children?.props?.formData || "",
      value: item.children?.props?.formData || "",
    })),
  );
  const addChip = (key: string, value: string) => {
    setChips([...chips, { key, value }]);
  };
  const removeChip = (chip: FilterChipType) => {
    setChips(
      chips.filter(
        (c) => (c.key !== chip.key && c.value !== chip.value) || false,
      ),
    );
  };
  const onClearAll = () => {
    setChips([]);
  };
  console.log("chips", chips);
  return (
    <>
      <FilterChipInput onAdd={addChip} />
      <FilterChips
        chips={chips}
        onClearAll={onClearAll}
        onRemove={(chip) => removeChip(chip)}
      />
    </>
  );
};

// Must use a separate input component to dynamically add chips
// Since leafygreen knobs rerender the component on every change
const FilterChipInput = ({
  onAdd,
}: {
  onAdd: (key: string, value: string) => void;
}) => {
  const [chipKey, setChipKey] = useState("");
  const [chipValue, setChipValue] = useState("");

  const handleAdd = () => {
    onAdd(chipKey, chipValue);
    setChipKey("");
    setChipValue("");
  };
  return (
    <StyledFilterChipInput>
      <TextInput
        className="text-input"
        label="Disabled GraphQL Queries"
        onChange={(e) => {
          setChipValue(e.target.value);
          setChipKey(e.target.value);
        }}
        placeholder="value"
        value={chipValue}
      />
      <StyledButton
        className="add-button"
        onClick={handleAdd}
        variant={Variant.Primary}
      />
    </StyledFilterChipInput>
  );
};

const StyledFilterChipInput = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.s};

  .text-input {
    flex-grow: 1;
  }

  .add-button {
    flex-shrink: 0;
  }
  margin-bottom: ${size.s};
`;

const StyledButton = styled(PlusButton)`
  margin-top: 25px;
`;

export default ArrayFieldTemplate;
