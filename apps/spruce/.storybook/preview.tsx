import { Preview } from "@storybook/react-vite";
import "components/styles/global.css";

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    apolloClient: {
      mocks: [],
    },
  },
};

export default preview;
