import { useState } from "react";
import styled from "@emotion/styled";
import TextInput from "@leafygreen-ui/text-input";
import { size } from "@evg-ui/lib/constants/tokens";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import { PlusButton, Variant } from "components/Buttons";

import { FormChipType } from "./FormChip";
import FormChips from ".";

export default {
  component: FormChips,
} satisfies CustomMeta<typeof FormChips>;

export const Default: CustomStoryObj<typeof FormChips> = {
  render: () => <ChipContainer />,
};

const ChipContainer = () => {
  const [chips, setChips] = useState<FormChipType[]>([
    { key: "test", value: "test" },
  ]);

  const addChip = (key: string, value: string) => {
    setChips([...chips, { key, value }]);
  };
  const removeChip = (chip: FormChipType) => {
    setChips(
      chips.filter(
        (c) => (c.key !== chip.key && c.value !== chip.value) || false,
      ),
    );
  };
  const onClearAll = () => {
    setChips([]);
  };

  return (
    <div>
      <FormChipInput onAdd={addChip} />
      <FormChips chips={chips} onClearAll={onClearAll} onRemove={removeChip} />
    </div>
  );
};

// Must use a separate input component to dynamically add chips
// Since leafygreen knobs rerender the component on every change
const FormChipInput = ({
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
    <StyledFormChipInput>
      <TextInput
        className="text-input"
        label="Form Chips Input"
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
    </StyledFormChipInput>
  );
};

const StyledFormChipInput = styled.div`
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
