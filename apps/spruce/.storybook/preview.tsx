import { Preview } from "@storybook/react-vite";
import { ViaProvider } from "@via-ds/components/provider";
import { ColorScheme } from "@via-ds/components/types";
import "components/styles/global.css";
import "@via-ds/components/index.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <ViaProvider colorScheme={ColorScheme.Light} locale="en-US">
        <Story />
      </ViaProvider>
    ),
  ],
  tags: ["autodocs"],
  parameters: {
    apolloClient: {
      mocks: [],
    },
  },
};

export default preview;
