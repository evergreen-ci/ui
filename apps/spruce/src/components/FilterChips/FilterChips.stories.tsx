import { useState } from "react";
import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { TextInput } from "@leafygreen-ui/text-input";
import { size } from "@evg-ui/lib/constants";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";

import { toSentenceCase } from "@evg-ui/lib/utils";
import { FilterChipType } from "./FilterChip";
import FilterChips from ".";

export default {
  component: FilterChips,
} satisfies CustomMeta<typeof FilterChips>;

export const Default: CustomStoryObj<typeof FilterChips> = {
  render: () => <ChipContainer />,
};

const ChipContainer = () => {
  const [chips, setChips] = useState<FilterChipType[]>([
    { key: "test", value: "test", title: "Test" },
  ]);

  const addChip = (key: string, value: string) => {
    setChips([...chips, { key, value, title: toSentenceCase(key) }]);
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

  return (
    <div>
      <FilterChips
        chips={chips}
        onClearAll={onClearAll}
        onRemove={removeChip}
      />
      <FilterChipInput onAdd={addChip} />
    </div>
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
    <div>
      <TextInput
        label="key"
        onChange={(e) => setChipKey(e.target.value)}
        placeholder="key"
        value={chipKey}
      />
      <TextInput
        label="value"
        onChange={(e) => setChipValue(e.target.value)}
        placeholder="value"
        value={chipValue}
      />
      <StyledButton onClick={handleAdd}>Add</StyledButton>
    </div>
  );
};

const StyledButton = styled(Button)`
  margin-top: ${size.s};
`;
