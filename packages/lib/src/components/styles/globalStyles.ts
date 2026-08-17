import { BaseFontSize, fontFamilies } from "@leafygreen-ui/tokens";

// Plain CSS strings so Emotion consumers (Spruce/Parsley global styles) can
// interpolate them while packages/lib itself stays off Emotion.
export const resetStyles = `
  /* Reset styles, usage recommended by LeafyGreen. */
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
`;

export const bodyStyles = `
  font-family: ${fontFamilies.default};
  font-size: ${BaseFontSize.Body1}px;
  margin: 0;
`;
