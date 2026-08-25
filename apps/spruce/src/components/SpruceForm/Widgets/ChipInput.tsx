import { useState } from "react";
import { TextInput } from "@leafygreen-ui/text-input";
import { CharKey } from "@evg-ui/lib/constants/keys";
import { PlusButton, Variant } from "components/Buttons";
import FilterChips from "../../FilterChips/index";
import ElementWrapper from "../ElementWrapper";
import styles from "./ChipInput.module.css";
import { SpruceWidgetProps } from "./types";

export const ChipInput: React.FC<SpruceWidgetProps> = ({
  disabled,
  label,
  onChange,
  options,
  readonly,
  value = [],
}) => {
  const [text, setText] = useState("");
  const { "data-testid": dataTestId, description, elementWrapperCSS } = options;
  const isDisabled = disabled || readonly;
  const chips = value.map((v: string) => ({
    key: v,
    value: v,
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
    <ElementWrapper className={styles.chipLayout} css={elementWrapperCSS}>
      <div className={styles.inputWrapper}>
        <TextInput
          className={styles.textInput}
          data-testid={dataTestId}
          description={description}
          disabled={isDisabled}
          label={label}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === CharKey.Enter && text && handleAdd()}
          value={text}
        />
        <PlusButton
          disabled={isDisabled || text.trim().length === 0}
          onClick={handleAdd}
          variant={Variant.Primary}
        />
      </div>
      <FilterChips
        chips={chips}
        onClearAll={() => onChange([])}
        onRemove={(chip) => removeChip(chip.value)}
        showValueOnly
        truncateChipLength={100}
      />
    </ElementWrapper>
  );
};
