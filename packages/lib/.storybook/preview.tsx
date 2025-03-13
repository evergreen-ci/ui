import { Global, css } from "@emotion/react";
import { Decorator } from "@storybook/react";
import { resetStyles, fontStyles, bodyStyles } from "components/styles";

export const globalStyles = css`
  ${resetStyles}
  ${fontStyles}
  body {
    ${bodyStyles}
  }
`;

export const decorators: Decorator[] = [
  (Story: () => JSX.Element) => (
    <>
      <Global styles={globalStyles} />
      <Story />
    </>
  ),
];
