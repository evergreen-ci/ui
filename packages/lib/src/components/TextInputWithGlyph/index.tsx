import { forwardRef } from "react";
import { TextInput, TextInputProps } from "@leafygreen-ui/text-input";
import { cx } from "../../utils/css";
import styles from "./index.module.css";

export type TextInputWithGlyphProps = {
  icon?: React.ReactElement;
  persistentPlaceholder?: React.ReactNode;
} & TextInputProps;

export const TextInputWithGlyph = forwardRef<
  HTMLInputElement,
  TextInputWithGlyphProps
>((props, ref) => {
  const { className, icon, persistentPlaceholder, ...rest } = props;
  return (
    <div className={cx(styles.textInputWrapper, className)}>
      {persistentPlaceholder && (
        <div
          className={cx(styles.persistentPlaceholder, "persistent-placeholder")}
        >
          {persistentPlaceholder}
        </div>
      )}
      <TextInput ref={ref} {...rest} />
      {icon && <div className={styles.iconWrapper}>{icon}</div>}
    </div>
  );
});

TextInputWithGlyph.displayName = "TextInputWithGlyph";
