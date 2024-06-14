import { Global, css } from "@emotion/react";
import { Decorator } from "@storybook/react";
import {
  overrideStyles,
  resetStyles,
} from "../src/components/styles/GlobalStyles";

export const decorators: Decorator[] = [
  (Story: () => JSX.Element) => (
    <>
      <Global
        styles={css`
          ${resetStyles}
          ${overrideStyles}
        `}
      />
      <Story />
    </>
  ),
];
