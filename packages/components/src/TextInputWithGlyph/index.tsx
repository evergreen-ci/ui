import { forwardRef } from "react";
import styled from "@emotion/styled";
import { size, textInputHeight } from "@evg-ui/constants";
import TextInput, { TextInputProps } from "@leafygreen-ui/text-input";

export type TextInputWithGlyphProps = {
  icon: React.ReactElement;
} & TextInputProps;

export const TextInputWithGlyph: React.FC<TextInputWithGlyphProps> = forwardRef(
  (props, ref) => {
    const { className, icon, ...rest } = props;

    return (
      <TextInputWrapper className={className}>
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
