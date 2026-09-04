import { Global } from "@emotion/react";
import { Decorator, Preview } from "@storybook/react-vite";
import { ViaProvider } from "@via-ds/components/provider";
import { ColorScheme } from "@via-ds/components/types";
import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { globalStyles } from "components/styles";
import { LogContextProvider } from "../src/context/LogContext";
import "@via-ds/components/index.css";

export const decorators: Decorator[] = [
  (Story: () => JSX.Element) => (
    <>
      <Global styles={globalStyles} />
      <Story />
    </>
  ),
  (Story: () => JSX.Element) => (
    <ViaProvider colorScheme={ColorScheme.Light} locale="en-US">
      <Story />
    </ViaProvider>
  ),
  (Story: () => JSX.Element) => (
    <LogContextProvider>
      <Story />
    </LogContextProvider>
  ),
  WithToastContext,
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
