import { Global } from "@emotion/react";
import { Decorator, Preview } from "@storybook/react-vite";
import { WithToastContext } from "@evg-ui/lib/test_utils";
import { globalStyles } from "components/styles";
import { getParsleySettingsMock } from "gql/mocks/getParsleySettings";
import { LogContextProvider } from "../src/context/LogContext";

export const decorators: Decorator[] = [
  (Story: () => JSX.Element) => (
    <>
      <Global styles={globalStyles} />
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
  parameters: {
    apolloClient: {
      mocks: [getParsleySettingsMock],
    },
  },
};

export default preview;
