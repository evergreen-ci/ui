import { Decorator, Preview } from "@storybook/react-vite";
import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { GlobalStyles } from "components/styles";
import { LogContextProvider } from "../src/context/LogContext";

export const decorators: Decorator[] = [
  (Story: () => JSX.Element) => (
    <>
      <GlobalStyles />
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

const preview: Preview = {
  tags: ["autodocs"],
};

export default preview;
