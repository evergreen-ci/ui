import { Global } from "@emotion/react";
import { Decorator, Preview } from "@storybook/react-vite";
import { globalStyles } from "components/styles";

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
