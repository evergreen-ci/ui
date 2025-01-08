import { Global, css } from "@emotion/react";
import { Decorator } from "@storybook/react";
import {
  spruceGlobalStyles
} from "@evg-ui/lib/components/styles";

export const decorators: Decorator[] = [
  (Story: () => JSX.Element) => (
    <>
      <Global styles={spruceGlobalStyles} />
      <Story />
    </>
  ),
];
