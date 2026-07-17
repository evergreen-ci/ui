import { css, Global } from "@emotion/react";
import { Decorator, Preview } from "@storybook/react-vite";
import { bodyStyles, fontStyles, resetStyles } from "components/styles";

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
  parameters: {
    apolloClient: {
      mocks: [],
    },
  },
  tags: ["autodocs"],
};

export default preview;
