import { Global, css } from "@emotion/react";
import { Decorator, Preview } from "@storybook/react-vite";
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

const preview: Preview = {
  tags: ["autodocs"],
};

export default preview;
