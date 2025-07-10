import { useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import TextInput from "@leafygreen-ui/text-input";
import { size } from "@evg-ui/lib/constants/tokens";
import { PlusButton, Variant } from "components/Buttons";
import FilterChips from "../../FilterChips/index";
import ElementWrapper from "../ElementWrapper";
import { SpruceWidgetProps } from "./types";

export const LeafyGreenChipInput: React.FC<SpruceWidgetProps> = ({
  disabled,
  label,
  onChange,
  options,
  readonly,
  value = [],
}) => {
  const [text, setText] = useState("");
  const { "data-cy": dataCy, elementWrapperCSS } = options;
  const isDisabled = disabled || readonly;
  const chips = value.map((v: string) => ({
    key: v,
    title: v,
  }));
  const handleAdd = () => {
    onChange([...value, text]);
    setText("");
  };
  const removeChip = (chip: string) => {
    const newItems = value.filter((v: string) => v !== chip);
    onChange(newItems);
  };
  return (
    <ElementWrapper
      css={css`
        ${chipStyles}
        ${elementWrapperCSS};
      `}
    >
      <InputWrapper>
        <ChipInput
          data-cy={dataCy}
          disabled={isDisabled}
          label={label}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && text && handleAdd()}
          value={text}
        />
        <StyledButton
          disabled={isDisabled || text.trim().length === 0}
          onClick={handleAdd}
          variant={Variant.Primary}
        />
      </InputWrapper>
      <FilterChips
        chips={chips}
        onClearAll={() => onChange([])}
        onRemove={(chip) => removeChip(chip.title)}
        showTitleOnly
      />
    </ElementWrapper>
  );
};
const chipStyles = css`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
`;
const ChipInput = styled(TextInput)`
  flex-grow: 1;
`;
const InputWrapper = styled.div`
  min-width: 100%;
  display: flex;
  align-items: flex-end;
  gap: ${size.xs};
`;
const StyledButton = styled(PlusButton)`
  margin-top: 25px;
`;
