import { Global, css } from "@emotion/react";
// Defines the --via-* custom properties that @evg-ui/lib CSS modules consume.
import "@via-ds/tokens/tokens.css";
import { Decorator, Preview } from "@storybook/react-vite";
import { bodyStyles, resetStyles } from "@evg-ui/lib/components/styles";

export const globalStyles = css`
  ${resetStyles}
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
  parameters: {
    apolloClient: {
      mocks: [],
    },
  },
};

export default preview;
