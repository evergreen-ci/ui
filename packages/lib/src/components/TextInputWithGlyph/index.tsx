import { forwardRef } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import TextInput, { TextInputProps } from "@leafygreen-ui/text-input";
import { size, textInputHeight } from "../../constants/tokens";

const { gray } = palette;

export type TextInputWithGlyphProps = {
  icon: React.ReactElement;
  persistentPlaceholder?: React.ReactNode;
} & TextInputProps;

export const TextInputWithGlyph: React.FC<TextInputWithGlyphProps> = forwardRef(
  (props, ref) => {
    const { className, icon, persistentPlaceholder, ...rest } = props;

    return (
      <TextInputWrapper className={className}>
        {persistentPlaceholder && (
          <PersistentPlaceholder>{persistentPlaceholder}</PersistentPlaceholder>
        )}
        <TextInput ref={ref} {...rest} />
        <IconWrapper>{icon}</IconWrapper>
      </TextInputWrapper>
    );
  },
);

TextInputWithGlyph.displayName = "TextInputWithGlyph";

const TextInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PersistentPlaceholder = styled.span`
  position: absolute;
  left: 12px;
  top: 0;
  height: ${textInputHeight};
  display: flex;
  align-items: center;
  color: ${gray.dark1};
  opacity: 0.5;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  z-index: 2;
  /* Make sure it doesn't overlap the icon */
  max-width: 100%;
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
