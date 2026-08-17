import { Decorator, Preview } from "@storybook/react-vite";
// Defines the --via-* custom properties that the CSS modules consume.
import "@via-ds/tokens/tokens.css";
import { bodyStyles, fontStyles, resetStyles } from "components/styles";

export const globalStyles = `
  ${resetStyles}
  ${fontStyles}
  body {
    ${bodyStyles}
  }
`;

export const decorators: Decorator[] = [
  (Story: () => JSX.Element) => (
    <>
      <style>{globalStyles}</style>
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
