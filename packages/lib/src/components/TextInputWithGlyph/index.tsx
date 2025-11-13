import { forwardRef } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { TextInput, TextInputProps } from "@leafygreen-ui/text-input";
import { size, textInputHeight } from "../../constants/tokens";

const { gray } = palette;

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
    <TextInputWrapper className={className}>
      {persistentPlaceholder && (
        <PersistentPlaceholder className="persistent-placeholder">
          {persistentPlaceholder}
        </PersistentPlaceholder>
      )}
      <TextInput ref={ref} {...rest} />
      {icon && <IconWrapper>{icon}</IconWrapper>}
    </TextInputWrapper>
  );
});

TextInputWithGlyph.displayName = "TextInputWithGlyph";

const TextInputWrapper = styled.div`
  position: relative;
  width: 100%;

  input {
    padding-right: ${size.m};
  }
`;

const PersistentPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 16px;
  height: ${textInputHeight};
  color: ${gray.dark1};
  opacity: 0.5;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  z-index: 2;
`;

const IconWrapper = styled.div`
  align-items: center;
  display: flex;
  bottom: 0;
  height: ${textInputHeight};
  position: absolute;
  right: ${size.xxs};
  width: ${size.l};
  justify-content: center;
`;
