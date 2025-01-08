import { Global } from "@emotion/react";
import { Decorator } from "@storybook/react";
import { parsleyGlobalStyles } from "@evg-ui/lib/components/styles";
import { LogContextProvider } from "../src/context/LogContext";
import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";

export const decorators: Decorator[] = [
  (Story: () => JSX.Element) => (
    <>
      <Global styles={parsleyGlobalStyles} />
      <Story />
    </>
  ),
  (Story: () => JSX.Element) => (
    <LogContextProvider>
      <Story />
    </LogContextProvider>
  ),
  WithToastContext,
];
