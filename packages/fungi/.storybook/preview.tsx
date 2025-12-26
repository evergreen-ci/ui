import { Global, css } from "@emotion/react";
import { Decorator, Preview } from "@storybook/react-vite";
import { resetStyles, bodyStyles } from "@evg-ui/lib/components/styles";

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
