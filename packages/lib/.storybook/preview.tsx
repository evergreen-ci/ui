import { Decorator, Preview } from "@storybook/react-vite";
import { ViaProvider } from "@via-ds/components/provider";
import { ColorScheme } from "@via-ds/components/types";
import "@via-ds/tokens/tokens.css";
import "@via-ds/components/index.css";
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
    <ViaProvider colorScheme={ColorScheme.Light} locale="en-US">
      <style>{globalStyles}</style>
      <Story />
    </ViaProvider>
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
