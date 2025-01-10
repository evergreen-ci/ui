import { Global, css } from "@emotion/react";
import { Decorator } from "@storybook/react";
import { globalStyles } from "components/styles";

export const decorators: Decorator[] = [
  (Story: () => JSX.Element) => (
    <>
      <Global styles={globalStyles} />
      <Story />
    </>
  ),
];
