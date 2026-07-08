import { Decorator, Preview } from "@storybook/react-vite";

import "../src/index.css";

export const decorators: Decorator[] = [
  (Story: () => JSX.Element) => <Story />,
];

const preview: Preview = {
  tags: ["autodocs"],
};

export default preview;
